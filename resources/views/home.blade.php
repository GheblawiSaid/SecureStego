@extends('../layouts.app')

@section('content')
<body>
    <div class="card text-center mb-4">
        <div class="card-body">
            <h1 class="display-4 font-weight-bold">Secure Steganography Image Digital Watermarking for
                Photographers And Content Creators By Using Subtype of
                Spatial Domain Method</h1>
        </div>
    </div>

    <div class="card-header">
        @if (session('error'))
            <div class="alert alert-danger">
                {{ session('error') }}
            </div>
        @endif
    </div>

    <div class="container-fluid" id="my-tab-content">
        <div class="row">
            <div class="col-md-6">
                <div class="header">DECODE</div>
                <p class="alert alert-info">
                    To view the watermark from an image, simply select the image and click the <strong>Decode</strong> button.<br/><br/>
                </p>
                <form class="form">
                    <div class="form-group" >
                        <input class="form-control" type="file" name="decodeFile" onchange="previewDecodeImage()">
                    </div>
                    <div class="form-group">
                        <textarea id="decodePassword" class="form-control" type="password" placeholder="Enter password"></textarea>
                        <button class="decode btn btn-default pull-right" type="button" onclick="decodeMessage()">Decode</button>
                    </div>
                </form>
                <div class="clearfix"></div>

                <div class="binary-decode text-with-black-background" style="display: none;">
                    <h3>Hidden Watermark</h3>
                    <textarea class="form-control message" style="word-wrap:break-word;"></textarea>
                </div>
                <div class="decode text-with-black-background" style="display: none;">
                    <h3>Input</h3>
                    <canvas></canvas>
                </div>
            </div>
            <div class="col-md-6">
                <div class="header">ENCODE</div>
                <p class="alert alert-info">
                    To watermark a watermark within an image, select the image you wish to use, input your text, and click the <strong>Encode</strong> button. <br/>
                    Save the final image, as it will contain your watermark. <br/>
                    <Strong>Note:  </Strong>Keep in mind that the more text you want to hide, the larger the image needs to be. If the image you select is too small to contain your message, you will be notified.<br/><br/>
                </p>
                <form class="form">
                    <div class="form-group">
                        <input class="form-control" type="file" name="baseFile" onchange="previewEncodeImage()">
                    </div>
                    <div class="form-group">
                        <textarea id="waterMarkMessage" class="form-control message" rows="3" placeholder="Enter your message here"></textarea>
                    </div>
                    <div class="form-group">
                        <textarea id="encodePassword" class="form-control" type="password" placeholder="Enter password"></textarea>
                        <button class="encode btn btn-default" type="button" onclick="encodeMessage()" style="float: left;">Encode</button>
                    </div>
                </form>
                <div class="clearfix"></div>
                <div class="error" style="display: none;"></div>
                <div class="binary text-with-black-background" style="display: none;">
                    <h3>Binary representation of your Watermark</h3>
                    <textarea class="form-control message" style="word-wrap: break-word;" aria-label="Binary representation of your Watermark"></textarea>
                </div>
                <div class="images text-with-black-background" style="display: none;">
                    <div class="original" style="display: none;">
                        <h3>Original Photo Preview</h3>
                        <canvas></canvas>
                    </div>
                    <div class="nulled text-with-black-background" style="display: none;">
                        <h3>Normalized</h3>
                        <canvas></canvas>
                    </div>
                    <div class="message text-with-black-background" style="display: none;">
                        <h3>Processed Image</h3>
                        <canvas></canvas>
                    </div>
                    <div class="message" style="display: none;">
                        <h3>Click Save Photo Down Below</h3>
                        <canvas></canvas>
                        <button class="btn btn-primary mt-3" onclick="saveImage()">Save Photo</button>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <img src="{{ asset('images/monalisa.png') }}" alt="Mona Lisa" style="position: fixed; bottom: 0; right: 0; width:350px; height:auto;">
    <img src="{{ asset('images/monalisa.png') }}" alt="Mona Lisa" style="position: fixed; bottom: 0; left: 0; width:350px; height:auto; transform: rotateY(180deg);">

    <div class="status-card alert alert-info" style="display: none; position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000;">
        <span class="status-message"></span>
    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="{{ asset('js/script.js') }}"></script>
</body>
@endsection



