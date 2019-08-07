$( () => {
    // <--- Socket --->
    let socket = io(); // Constructs socket from index.ejs and server
    
    // <--- Variable --->
    let name = prompt("Please Enter Your Name:") // to send to server
    let sessionId = null; // to send to server
    let chat = null;

    // <--- AJAX --->
    // New Message
    $('#submit').click( () => {
        let message = $('#message').val(); // grabs input message
        $('#message').val(''); // clears input field
        socket.emit('new_message', {name: name, sessionId: sessionId, message: message});
    })

    // Leave window
    $(window).on("beforeunload", () => {
        socket.emit('user_disconnect', {name: name, sessionId: sessionId}); // sends name information to server
    })

    // <--- Socketing --->
    // Server requests new user information
    socket.on('get_name', () => {
        console.log(`Joining as ${name}`)
        socket.emit('new_user', {name: name});
    })

    // Announce that new user has joined
    socket.on('new_user_joined', data => {
        sessionId = data.sessionId; // sets session ID for client
        chat = ""; // sets chat to blank

        // Loops through each element in the log and appends to the chat html
        data.log.forEach(element => {
            chat += `<p id="${element.sessionId}" class="text-light">${element.message}</p>`
        });

        $('#chat').html(chat); // update sthe innerHTML of the chat window
    });

    // Update chat log after new message received
    socket.on('update_chat', data => {
        chat = ""; // sets chat to blank
        // Loops through each element in log and appends to chat html
        data.log.forEach(element => {
            chat += `<p id="${element.sessionId}" class="text-light">${element.message}</p>`
        });

        $('#chat').html(chat); // update sthe innerHTML of the chat window
    })
});