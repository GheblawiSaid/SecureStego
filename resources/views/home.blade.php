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



    <div class="container-fluid">
        <div class="row">
            <div class="col-md-6">
                <div class="header">DECODE</div>
                <div class="card d-flex align-items-center justify-content-center" style="height: 50vh;" id="drop_zone" ondrop="drop(event)" ondragover="allowDrop(event)">
                    <div style="font-size: 2em; text-align: center;">DROP YOUR IMAGE HERE</div>
                </div>
                <div class="d-flex justify-content-center">
                    <button class="btn" style="background-color: #ADD8E6; font-size: 1.5em;">DECODE</button>
                </div>
            </div>
            <div class="col-md-6">
                <div class="header">ENCODE</div>
                <div class="card d-flex align-items-center justify-content-center" style="height: 40vh;" id="drop_zone" ondrop="drop(event)" ondragover="allowDrop(event)">
                    <div style="font-size: 2em; text-align: center;">DROP YOUR IMAGE HERE</div>
                </div>
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="ADD YOUR WATERMARK:" aria-label="Watermark" style="height: 10vh;">
                </div>
                <div class="d-flex justify-content-center">
                    <button class="btn" style="background-color: #ADD8E6; font-size: 1.5em;">ENCODE</button>
                </div>
            </div>
        </div>
    </div>
    <img src="{{ asset('images/monalisa.png') }}" alt="Mona Lisa" style="position: fixed; bottom: 0; right: 0; width:350px; height:auto;">
    <img src="{{ asset('images/monalisa.png') }}" alt="Mona Lisa" style="position: fixed; bottom: 0; left: 0; width:350px; height:auto; transform: rotateY(180deg);">;

    <script>
        function allowDrop(ev) {
            ev.preventDefault();
        }

        function drop(ev) {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            ev.target.appendChild(document.getElementById(data));
        }
    </script>
</body>


@endsection
