@extends('../layouts.app')

@section('content')
<body>

    <div class="card-header">
        @if (session('error'))
             <div class="alert alert-danger">
                 {{ session('error') }}
             </div>
        @endif
    </div>

    <div class="container-fluid" id="my-tab-content">
        <div class="row">
            <div class="col-md-6" id="decode">
                <div class="header">DECODE</div>
                <p class="alert alert-info">
                    To view the watermark from an image, simply select the image and click the <strong>Decode</strong> button.<br/><br/>
                </p>
                <form class="form">
                    <div class="form-group">
                      <input class="form-control" type="file" name="decodeFile" onchange="previewDecodeImage()">
                    </div>
                    <div class="form-group">
                      <button class="decode btn btn-default pull-right" type="button" onclick="decodeMessage()">Decode</button>
                    </div>
                </form>
                <div class="clearfix"></div>

                <div class="binary-decode" style="display: none;">
                    <h3>Hidden message</h3>
                    <textarea class="form-control message" style="word-wrap:break-word;"></textarea>
                </div>
                <div class="decode" style="display: none;">
                    <h3>Input</h3>
                    <canvas></canvas>
                </div>
            </div>
            <div class="col-md-6" id="encode">
                <div class="header">ENCODE</div>
                <p class="alert alert-info">
                    To watermark a message within an image, select the image you wish to use, input your text, and click the <strong>Encode</strong> button. <br/>
                    Save the final image, as it will contain your watermark. <br/>
                    Keep in mind that the more text you want to hide, the larger the image needs to be. If the image you select is too small to contain your message, you will be notified.<br/><br/>
                </p>
                <form class="form">
                    <div class="form-group">
                      <input class="form-control" type="file" name="baseFile" onchange="previewEncodeImage()">
                    </div>

                    <div class="form-group">
                      <textarea class="form-control message" rows="3" placeholder="Enter your message here"></textarea>
                    </div>

                    <div class="form-group">
                      <button class="encode btn btn-default pull-right" type="button" onclick="encodeMessage()">Encode</button>
                    </div>
                </form>
                <div class="clearfix"></div>
                <div class="error" style="display: none;"></div>
                <div class="binary" style="display: none;">
                    <h3>Binary representation of your message</h3>
                    <textarea class="form-control message" style="word-wrap:break-word;"></textarea>
                </div>
                <div class="images" style="display: none;">
                    <div class="original" style="display: none;">
                        <h3>Original</h3>
                        <canvas></canvas>
                    </div>
                    <div class="nulled" style="display: none;">
                        <h3>Normalized</h3>
                        <canvas></canvas>
                    </div>
                    <div class="message" style="display: none;">
                        <h3>Message hidden in image (right click <span class="glyphicon glyphicon-arrow-right"></span> save as)</h3>
                        <canvas></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <img src="{{ asset('images/monalisa.png') }}" alt="Mona Lisa" style="position: fixed; bottom: 0; right: 0; width:350px; height:auto;">
    <img src="{{ asset('images/monalisa.png') }}" alt="Mona Lisa" style="position: fixed; bottom: 0; left: 0; width:350px; height:auto; transform: rotateY(180deg);">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="{{ asset('js/script.js') }}"></script>
</body>
@endsection

