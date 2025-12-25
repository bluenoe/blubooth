<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index()
    {
        // Only fetch photo strips (final composite images)
        $photos = Photo::where('user_id', auth()->id())
            ->where('type', 'strip')
            ->latest()
            ->paginate(20);

        return Inertia::render('Gallery/Index', [
            'photos' => $photos
        ]);
    }


    public function destroy($id)
    {
        $photo = Photo::where('user_id', auth()->id())->findOrFail($id);

        // 1. Xóa file trong ổ cứng
        if (Storage::disk('public')->exists($photo->path)) {
            Storage::disk('public')->delete($photo->path);
        }

        // 2. Xóa trong database
        $photo->delete();

        return redirect()->back()->with('message', 'Photo removed from archive.'); // Tiếng Anh cho sang
    }
}
