const post = await PostModel.aggregate([
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
                        $lookup: {
                           from: "community_post_likes",
                           localField: "_id",
                           foreignField: "post_id",
                           as: "community_post_likes",
                        }
                    },

                    {
                        $project: {
                          "_id": 1,
                          "privacy_option": 1,
                          "is_anonymous":1,
                          "post_upload_type":1,
                          "created_at":1,
                          "updated_at":1,
                          "status":1,
                          "user_id":1,
                          "description":1,
                          "post_upload_file":1,
                          "username": {$concat: ['$users.first_name', ' ', '$users.last_name']},
                          "profile_image": {$concat: ['$users.profile_image']},
                          "post_upload_file": 1,
                          "like_type": '$community_post_likes.like_type', 
                          "like_user_id": '$community_post_likes.user_id',
                          "numOfLikes":{ $size:"$community_post_likes" }
                        }
                    }
                ]).sort({"_id": -1});
