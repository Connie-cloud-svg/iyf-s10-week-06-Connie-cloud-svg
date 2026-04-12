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

// After refactoring to Promises:
getUserData(123)
    .then(user => {
        console.log("User:", user);
        return getUserPosts(user.id);
    })
    .then(posts => {
        console.log("Posts:", posts);
        return getPostComments(posts[0].id);
    })
    .then(comments => {
        console.log("Comments:", comments);
    })
    .catch(error => {
        console.error("Error:", error);
    });


    // Run multiple promises in parallel
const promise1 = getUserData(1);
const promise2 = getUserData(2);
const promise3 = getUserData(3);

Promise.all([promise1, promise2, promise3])
    .then(results => {
        console.log("All users:", results);
        // results is an array [user1, user2, user3]
    })
    .catch(error => {
        // If ANY promise fails, this runs
        console.error("One failed:", error);
    });


  async function fetchUserData(userId) {
    try {
        const user = await getUserData(userId);
        const posts = await getUserPosts(user.id);
        const comments = await getPostComments(posts[0].id);
        
        console.log("User:", user);
        console.log("Posts:", posts);
        console.log("Comments:", comments);
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error; // re-throwing the error to be handled by the caller
    }
  }  


  async function getUserInfo(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error; // re-throwing the error to be handled by the caller
    }
  }

  const user = getUserInfo(1);
    user.then(data => console.log("User Data:", data));


async function getUserPostsAndComments(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error fetching user posts:", error);
        throw error;
    }
}

const posts = getUserPostsAndComments(1);
posts.then(data => console.log("User Posts:", data));


