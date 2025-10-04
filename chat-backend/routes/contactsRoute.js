const Message = require('../models/Message'); // Assuming this path
const User = require('../models/User');     // Assuming this path
const mongoose = require('mongoose');

// Function to find all unique users the current user has chatted with
exports.getContacts = async (req, res) => {
    // Assuming the current user's ID is available from the request, 
    // e.g., via a middleware that verifies the JWT and attaches user info (req.userId)
    // If not using middleware, you might pass it as a URL parameter: req.params.userId
    const currentUserId = req.params.userId; 

    if (!currentUserId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const userId = new mongoose.Types.ObjectId(currentUserId);
        
        // 1. Find all messages involving the current user
        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userId },
                        { recipient: userId }
                    ]
                }
            },
            // 2. Group all matching messages and collect the IDs of all users involved
            {
                $group: {
                    _id: null,
                    // Collect all sender and recipient IDs into one array
                    allUsers: { 
                        $addToSet: { 
                            $cond: [{ $ne: ["$sender", userId] }, "$sender", "$recipient"]
                        } 
                    }
                }
            },
            // 3. Unwind the array of all users to one document per contact
            {
                $unwind: "$allUsers"
            },
            // 4. Exclude the current user from the list (though $cond should handle most of this)
            {
                $match: {
                    allUsers: { $ne: userId }
                }
            },
            // 5. Look up the User document for each unique contact ID
            {
                $lookup: {
                    from: "users", // MongoDB collection name for the User model (usually pluralized lowercase)
                    localField: "allUsers",
                    foreignField: "_id",
                    as: "contactDetails"
                }
            },
            // 6. Reshape the output to return just the contact details array
            {
                $replaceRoot: { newRoot: { $arrayElemAt: ["$contactDetails", 0] } }
            },
            // 7. Optionally, you can project specific fields (e.g., remove password)
            {
                $project: {
                    password: 0,
                }
            }
        ]);

        res.status(200).json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ message: 'Server error while fetching contacts' });
    }
};