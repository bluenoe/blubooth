<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Photo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BoothController extends Controller
{
    public function index()
    {
        // Lấy danh sách ảnh của user hiện tại, cái mới nhất lên đầu
        $photos = Photo::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Booth/Index', [
            'photos' => $photos // Gửi biến photos sang React
        ]);
    }

    public function store(Request $request)
    {
        // Validate dữ liệu gửi lên
        $request->validate([
            'image' => 'required|string',
        ]);

        // 1. Lấy dữ liệu ảnh (đang dạng base64: "data:image/png;base64,RxRkx...")
        $image_64 = $request->image;

        // 2. Tách phần header ra để lấy nội dung ảnh thuần
        $extension = explode('/', explode(':', substr($image_64, 0, strpos($image_64, ';')))[1])[1];   // .png
        $replace = substr($image_64, 0, strpos($image_64, ',') + 1);
        $image = str_replace($replace, '', $image_64);
        $image = str_replace(' ', '+', $image);

        // 3. Đặt tên file ngẫu nhiên (để không trùng)
        $imageName = Str::random(10) . '.' . $extension;

        // 4. Lưu vào ổ cứng (thư mục storage/app/public/photos)
        Storage::disk('public')->put('photos/' . $imageName, base64_decode($image));

        // 5. Lưu đường dẫn vào Database
        Photo::create([
            'user_id' => auth()->id(),
            'path' => 'photos/' . $imageName,
        ]);

        // 6. Trả về thông báo thành công cho React
        return redirect()->back()->with('message', 'Đã lưu ảnh vào album thành công!');
    }
    public function selectLayout()
    {
        return Inertia::render('Booth/SelectLayout');
    }
}
