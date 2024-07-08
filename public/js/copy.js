

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
        var password = $("textarea#encodePassword").val();
        var combinedMessage = password + text;

        if (password.trim() === '') {
            $(".error").text("Please enter a password to encode the message.").fadeIn();
            hideStatusMessage();
            return;
        }

        var $originalCanvas = $('.original canvas');
        var $nulledCanvas = $('.nulled canvas');
        var $messageCanvas = $('.message canvas');
        var originalContext = $originalCanvas[0].getContext("2d");
        var nulledContext = $nulledCanvas[0].getContext("2d");
        var messageContext = $messageCanvas[0].getContext("2d");
        var width = $originalCanvas[0].width;
        var height = $originalCanvas[0].height;

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
                showStatusMessage("Converting your watermark to binary...");
                var binaryMessage = "";
                for (var i = 0; i < combinedMessage.length; i++) {
                    var binaryChar = combinedMessage.charCodeAt(i).toString(2);
                    while (binaryChar.length < 8) {
                        binaryChar = "0" + binaryChar;
                    }
                    binaryMessage += binaryChar;
                }

                var { randomizedBinaryMessage, positions } = randomizeBinaryWatermark(binaryMessage);

                $('.binary textarea').text(randomizedBinaryMessage);

                setTimeout(() => {
                    showStatusMessage("Embedding the binary watermark into the image...");
                    var message = nulledContext.getImageData(0, 0, width, height);
                    pixel = message.data;
                    var counter = 0;
                    for (var i = 0, n = pixel.length; i < n; i += 4) {
                        for (var offset = 0; offset < 3; offset++) {
                            if (counter < randomizedBinaryMessage.length) {
                                pixel[i + offset] += parseInt(randomizedBinaryMessage[counter]);
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

                    localStorage.setItem('watermarkPositions', JSON.stringify(positions));

                    showStatusMessage("Encoding complete.");
                    setTimeout(hideStatusMessage, 3000);
                }, 2000);
            }, 2000);
        }, 2000);
    }, 500);
}





function randomizeBinaryWatermark(binaryMessage) {
    var array = binaryMessage.split('');
    var positions = array.map((_, index) => index);
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;


        temporaryValue = positions[currentIndex];
        positions[currentIndex] = positions[randomIndex];
        positions[randomIndex] = temporaryValue;
    }

    return {
        randomizedBinaryMessage: array.join(''),
        positions: positions
    };
}




function decodeMessage() {
    showStatusMessage("Starting decoding process...");

    setTimeout(() => {
        var $originalCanvas = $('.decode canvas');
        var originalContext = $originalCanvas[0].getContext("2d");
        var userEnteredPassword = $("textarea#decodePassword").val();

        if (userEnteredPassword.trim() === '') {
            showStatusMessage("Please enter the password to decode the message.");
            setTimeout(hideStatusMessage, 3000);
            return;
        }

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
                showStatusMessage("Restoring the original binary order...");
                var positions = JSON.parse(localStorage.getItem('watermarkPositions'));
                var restoredBinaryMessage = new Array(binaryMessage.length);

                for (var i = 0; i < positions.length; i++) {
                    restoredBinaryMessage[positions[i]] = binaryMessage[i];
                }

                setTimeout(() => {
                    showStatusMessage("Converting binary data to text...");
                    var output = "";
                    for (var i = 0; i < restoredBinaryMessage.length; i += 8) {
                        var c = 0;
                        for (var j = 0; j < 8; j++) {
                            c <<= 1;
                            c |= parseInt(restoredBinaryMessage[i + j]);
                        }
                        output += String.fromCharCode(c);
                    }

                    var embeddedPasswordLength = 3;
                    var embeddedPassword = output.substring(0, embeddedPasswordLength);
                    var messageWithoutPassword = output.substring(embeddedPasswordLength);

                    if (userEnteredPassword !== embeddedPassword) {
                        showStatusMessage("Incorrect password. Please try again.");
                        setTimeout(hideStatusMessage, 3000);
                        return;
                    }

                    $('.binary-decode textarea').text(messageWithoutPassword);
                    $('.binary-decode').fadeIn();

                    showStatusMessage("Decoding complete.");
                    setTimeout(hideStatusMessage, 3000);
                }, 2000);
            }, 2000);
        }, 2000);
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
