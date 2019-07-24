/**
 * student document
 */
let student = {
    "_id" : ObjectId("5cd03361593b69311c8c611b"),
    "rollNo" : "1",
    "firstName" : "deepak",
    "lastName" : "bawa",
    "dateOfBirth" : "1990-04-22"
};

/**
 * 
 * fees document
 */
let fees = {
    "_id" : ObjectId("5d37db5639db891fa9a0a397"),
    "student_id" : ObjectId("5cd03361593b69311c8c611b"),
    "amount" : 100.0,
    "created_date" : "2019-07-24",
    "updated_date" : "2019-07-24",
    "status" : "OPEN"
};

// results student with fees array of objects
db.student.aggregate([
    {
        $lookup: {
            from: 'fees',
            localField: '_id',
            foreignField: 'student_id',
            as: 'fees'
        }
    }
]);

// results fees with student array of objects
db.fees.aggregate([
    {
        $lookup: {
            from: 'student',
            localField: 'student_id',
            foreignField: '_id',
            as: 'student'
        }
    }
]);

/**
 * 
 * LOOKUP with PROJECTION
 * concat spell must concat instead of concate( e must be eliminated ).
 * Unwind converts the indexed array to string to use with concate
 * as concate do not support array
 * concate only supports strings
 * $unwind: must be placed after $lookup
 * the alias must be qouted with single or double qoutes
 */
db.fees.aggregate([
    {
        $lookup: {
            from: 'student',
            localField: 'student_id',
            foreignField: '_id',
            as: 'student'
        }
    },
    {
        $unwind: "$student"
    },
    {
        $project: {
            _id: 1,
            student_id: 1,
            amount: 1,
            created_date: 1,
            updated_date: 1,
            status: 1,
            rollno: '$student.rollNo',
            student_name: {
                $concat: [
                    '$student.firstName',
                    ' ',
                    '$student.lastName'
                ]
            }
        }
    }
]);

// 
db.student.aggregate([
    {
        $lookup: {
            from: 'fees',
            localField: '_id',
            foreignField: 'student_id',
            as: 'fees'
        }
    },
    {
        $unwind: "$fees"
    },
    {
        $project: {
            _id: 1,
            rollNo: 1,
            firstName: 1,
            lastName: 1,
            created_date: 1,
            updated_date: 1,
            status: 1,
            amount: '$fees.amount',
            amountDeposit: '$fees.created_date'
        }
    }
]);

/**
 * 
 * fees aggregate
 * if you remove the group clause the result would be same
 */
db.fees.aggregate([
    {
        $lookup: {
            from: 'student',
            localField: 'student_id',
            foreignField: '_id',
            as: 'student'
        }
    },
    {
        $unwind: "$student"
    },
    {
        $project: {
            _id: 1,
            student_id: 1,
            amount: 1,
            created_date: 1,
            updated_date: 1,
            status: 1,
            rollno: '$student.rollNo',
            student_name: {
                $concat: [
                    '$student.firstName',
                    ' ',
                    '$student.lastName'
                ]
            }
        }
    },
    {
        $group: {
            _id: "$_id",
            rollno: {
                "$first": "$rollno"                
            },
            student_id: {
                "$first": "$student_id"                
            },
            student_name: {
                "$first": "$student_name"
            },
            amount: {
                "$first": "$amount",
            },
            created_date: {
                "$first": "$created_date",
            },
            updated_date: {
                "$first": "$updated_date",
            },
            status: {
                "$first": "$status",
            }
        }
    }
]);

/**
 * 
 * get sum group by
 * the names you alias in $project must be same in $group
 * if you remove the group by clause the rows would be seperated and amount is atomic without addition
 * feesPaidCnt total number of times the fees paid
 * one can use $size clause to count the total rows only if the table is not unwind
 * if the table is unwind use $sum:1 to count the rows
 */
db.student.aggregate([
    {
        $lookup: {
            from: 'fees',
            localField: '_id',
            foreignField: 'student_id',
            as: 'fees'
        }
    },
    {
        $unwind: "$fees"
    },
    {
        $project: {
            _id: 1,
            rollNo: 1,
            firstName: 1,
            lastName: 1,
            status: 1,
            amount: '$fees.amount'
        }
    },
    {
        $group: {
            _id: "$_id",
            rollNo: {
                "$first": "$rollNo"
            },
            firstName: {
                "$first": "$firstName"
            },
            lastName: {
                "$first": "$lastName"
            },
            total: {
                $sum: "$amount"
            },
            feesPaidCnt: {
                $sum: 1
            }
        }
    }
]);
