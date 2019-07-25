const post = await PostLikesModel.aggregate([
            {
                $match: {
                    'user_id': user_id
                }
            },
            { 
                $lookup: {
                   from: "community_posts",
                   localField: "post_id",
                   foreignField: "_id",
                   as: "community_posts",
                }
            },

            {
                $unwind: "$community_posts"
            },

            { 
                $lookup: {
                   from: "users",
                   localField: "user_id",
                   foreignField: "_id",
                   as: "users",
                }
            },

            {
                $unwind: "$users"
            },

            {
                $project: {
                    "_id": 1,
                    "post_id": 1,
                    "user_id": 1,
                    "like_type": 1,
                    "created_at":1,
                    "updated_at":1,
                    "status":1,
                    "status":1,

                    "privacy_option": "$community_posts.privacy_option",
                    "is_anonymous": "$community_posts.is_anonymous",
                    "post_upload_type": "$community_posts.post_upload_type",
                    "post_created_by_user_id": "$community_posts.user_id",
                    "description": "$community_posts.description",
                    "post_upload_file": "$community_posts.post_upload_file",
                    
                    "first_name": "$users.first_name",
                    "last_name": "$users.last_name",
                    "user_profile_image": "$users.profile_image"
                }
            }
        ]);
