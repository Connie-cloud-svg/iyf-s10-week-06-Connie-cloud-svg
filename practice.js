console.log("1 - start");
console.log("2 - middle");
console.log("3 - end");
// returns in order of 1, 2, 3

console.log ("Start");

setTimeout(() => { 
    console.log("Middle - this is delayed by 2 seconds");
}, 2000);

console.log("End");
// returns in order of Start, End, Middle - because the middle is delayed by 2 seconds

console.log("A");

setTimeout(() => console.log("B"), 0);

console.log("C");

setTimeout(() => console.log("D"), 100);

console.log("E");

// prints in order of A, C, E, B, D


// Simulating an asynchronous operation, such as fetching user data from a database
function loadUser(userId, callback) {
    setTimeout(() => {
        const user = { id: userId, name: "Baron Jamal", email: "baronttj@gmail.com" };
        callback(user);
    }, 1500);
}

loadUser(25443, function(user) {
    console.log("User loaded: ", user);
});


// Now let's convert the above callback-based function to return a Promise instead
function getUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve({ id: userId, name: "John" });
            } else {
                reject("Invalid user ID");
            }
        }, 1000);
    });
}

getUserData(123)
    .then(user => {
        console.log("User data: ", user);
    })
    .catch(error => {
        console.log("Error: ", error);
    });

// Simulating another asynchronous operation, such as fetching posts for a user
function getUserPosts(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve([
                    {id: 1, title: "Post 1"},
                    {id: 2, title: "Post 2"},
                ]);   
            } else {
                reject("Invalid user ID");
            }
        }, 1000);
    });
}

getUserPosts(123)
    .then(posts => {
        console.log("User posts: ", posts);
    })
    .catch(error => {
        console.log("Error: ", error);
    });

// Simulating yet another asynchronous operation, such as fetching comments for a post
function getPostComments(postId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (postId > 0) {
                resolve([
                    {id: 1, text: "Great Post!"},
                    {id: 2, text: "Thanks for sharing!"},
                ]);
            } else {
                reject("Invalid Post ID");
            }
        }, 1000);
    });
}

getPostComments(1)
    .then(comments => {
        console.log("Post comments: ", comments);
    })
    .catch(error => {
        console.log("Error: ", error);
    });



