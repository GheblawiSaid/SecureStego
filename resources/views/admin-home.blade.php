@extends('../layouts.app')

@section('content')
    <body>
        <div class="header">
            <h1>HELLO ADMIN</h1>
        </div>
        <div class="container mt-4">
            <div class="row mb-3">
                <div class="col-md-2">
                    <label>USER NAME</label>
                </div>
                <div class="col-md-10">
                    <div class="user-section">
                        <div class="row mb-2">
                            <div class="col-md-2">
                                <label>NAME</label>
                            </div>
                            <div class="col-md-4">
                                <input type="text">
                            </div>
                            <div class="col-md-2">
                                <label>PASSWORD</label>
                            </div>
                            <div class="col-md-4">
                                <input type="password">
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-2">
                                <label>EMAIL</label>
                            </div>
                            <div class="col-md-4">
                                <input type="email">
                            </div>
                            <div class="col-md-6 text-end">
                                <button class="btn btn-delete">DELETE</button>
                                <button class="btn btn-save">SAVE</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>


@endsection
