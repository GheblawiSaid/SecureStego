

$('button.encode, button.decode').click(function(event) {
    event.preventDefault();
});

function showStatusMessage(message) {
    $(".status-message").text(message);
    $(".status-card").fadeIn();
}

function hideStatusMessage() {
    $(".status-card").fadeOut();
}

function previewDecodeImage() {
    var file = document.querySelector('input[name=decodeFile]').files[0];
    previewImage(file, ".decode canvas", function() {
        $(".decode").fadeIn();
    });
}

function previewEncodeImage() {
    var file = document.querySelector("input[name=baseFile]").files[0];
    $(".images .nulled").hide();
    $(".images .message").hide();
    previewImage(file, ".original canvas", function() {
        $(".images .original").fadeIn();
        $(".images").fadeIn();
    });
}

function previewImage(file, canvasSelector, callback) {
    var reader = new FileReader();
    var image = new Image();
    var $canvas = $(canvasSelector);
    var context = $canvas[0].getContext('2d');

    if (file) {
        reader.readAsDataURL(file);
    }

    reader.onloadend = function() {
        image.src = URL.createObjectURL(file);
        image.onload = function() {
            $canvas.prop({
                'width': image.width,
                'height': image.height
            });
            context.drawImage(image, 0, 0);
            callback();
        };
    };
}



function encodeMessage() {
    showStatusMessage("Starting encoding process...");

    setTimeout(() => {
        $(".error").hide();
        $(".binary").hide();

        var text = $("textarea#waterMarkMessage").val();
        var password = $("textarea#encodePassword").val(); // Retrieve password
        var combinedMessage = password + text; // Combine password with message

        var $originalCanvas = $('.original canvas');
        var $nulledCanvas = $('.nulled canvas');
        var $messageCanvas = $('.message canvas');
        var originalContext = $originalCanvas[0].getContext("2d");
        var nulledContext = $nulledCanvas[0].getContext("2d");
        var messageContext = $messageCanvas[0].getContext("2d");
        var width = $originalCanvas[0].width;
        var height = $originalCanvas[0].height;

        // Check if password length is more than 3
        if (password.length > 3) {
            $(".error").text("The password length entered is not applicable. Maximum length should be 3 characters.").fadeIn();
            hideStatusMessage();
            return;
        }

        if ((combinedMessage.length * 8) > (width * height * 3)) {
            $(".error").text("Text too long for chosen image....").fadeIn();
            hideStatusMessage();
            return;
        }

        setTimeout(() => {
            showStatusMessage("Normalizing the image...");
            $nulledCanvas.prop({ 'width': width, 'height': height });
            $messageCanvas.prop({ 'width': width, 'height': height });

            var original = originalContext.getImageData(0, 0, width, height);
            var pixel = original.data;
            for (var i = 0, n = pixel.length; i < n; i += 4) {
                for (var offset = 0; offset < 3; offset++) {
                    if (pixel[i + offset] % 2 != 0) {
                        pixel[i + offset]--;
                    }
                }
            }
            nulledContext.putImageData(original, 0, 0);

            setTimeout(() => {
                showStatusMessage("Converting your message to binary...");
                var binaryMessage = "";
                for (var i = 0; i < combinedMessage.length; i++) {
                    var binaryChar = combinedMessage.charCodeAt(i).toString(2);
                    while (binaryChar.length < 8) {
                        binaryChar = "0" + binaryChar;
                    }
                    binaryMessage += binaryChar;
                }
                $('.binary textarea').text(binaryMessage);

                setTimeout(() => {
                    showStatusMessage("Embedding the binary message into the image...");
                    var message = nulledContext.getImageData(0, 0, width, height);
                    pixel = message.data;
                    var counter = 0;
                    for (var i = 0, n = pixel.length; i < n; i += 4) {
                        for (var offset = 0; offset < 3; offset++) {
                            if (counter < binaryMessage.length) {
                                pixel[i + offset] += parseInt(binaryMessage[counter]);
                                counter++;
                            } else {
                                break;
                            }
                        }
                    }
                    messageContext.putImageData(message, 0, 0);

                    $(".binary").fadeIn();
                    $(".images .nulled").fadeIn();
                    $(".images .message").fadeIn();

                    showStatusMessage("Encoding complete.");
                    setTimeout(hideStatusMessage, 3000);
                }, 2000); // Adjust delay as needed
            }, 2000); // Adjust delay as needed
        }, 2000); // Adjust delay as needed
    }, 500);
}





function decodeMessage() {
    showStatusMessage("Starting decoding process...");

    setTimeout(() => {
        var $originalCanvas = $('.decode canvas');
        var originalContext = $originalCanvas[0].getContext("2d");
        var userEnteredPassword = $("textarea#decodePassword").val(); // Retrieve password entered by user

        var original = originalContext.getImageData(0, 0, $originalCanvas.width(), $originalCanvas.height());
        var binaryMessage = "";
        var pixel = original.data;

        setTimeout(() => {
            showStatusMessage("Extracting binary data from the image...");
            for (var i = 0, n = pixel.length; i < n; i += 4) {
                for (var offset = 0; offset < 3; offset++) {
                    var value = 0;
                    if (pixel[i + offset] % 2 != 0) {
                        value = 1;
                    }
                    binaryMessage += value;
                }
            }

            setTimeout(() => {
                showStatusMessage("Converting binary data to text...");
                var output = "";
                for (var i = 0; i < binaryMessage.length; i += 8) {
                    var c = 0;
                    for (var j = 0; j < 8; j++) {
                        c <<= 1;
                        c |= parseInt(binaryMessage[i + j]);
                    }
                    output += String.fromCharCode(c);
                }

                // Extract the embedded password from the decoded output
                var embeddedPasswordLength = 3; // Adjust this according to your password length
                var embeddedPassword = output.substring(0, embeddedPasswordLength);
                var messageWithoutPassword = output.substring(embeddedPasswordLength);

                // Check if user-entered password matches the embedded password
                if (userEnteredPassword !== embeddedPassword) {
                    showStatusMessage("Incorrect password. Please try again.");
                    setTimeout(hideStatusMessage, 3000);
                    return;
                }

                // Display the decoded message without the password
                $('.binary-decode textarea').text(messageWithoutPassword);
                $('.binary-decode').fadeIn();

                showStatusMessage("Decoding complete.");
                setTimeout(hideStatusMessage, 3000);
            }, 2000); // Adjust delay as needed
        }, 2000); // Adjust delay as needed
    }, 500);
}




function saveImage() {
    const canvas = document.querySelector('.message canvas');
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'encoded-image.png';
    link.click();
}
