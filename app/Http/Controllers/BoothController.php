<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Photo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BoothController extends Controller
{
    /**
     * Step 1: Layout Selection Page (Entry Point)
     */
    public function selectLayout()
    {
        return Inertia::render('Booth/SelectLayout');
    }

    /**
     * Step 2: Capture Session Page
     */
    public function capture()
    {
        return Inertia::render('Booth/Capture');
    }

    /**
     * Step 3: Customize & Review Page (The Darkroom)
     */
    public function customize()
    {
        return Inertia::render('Booth/Customize');
    }

    /**
     * Legacy index - redirects to select
     */
    public function index()
    {
        return redirect()->route('booth.select');
    }

    /**
     * Store individual captured photo (legacy)
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|string',
        ]);

        $image_64 = $request->image;
        $extension = explode('/', explode(':', substr($image_64, 0, strpos($image_64, ';')))[1])[1];
        $replace = substr($image_64, 0, strpos($image_64, ',') + 1);
        $image = str_replace($replace, '', $image_64);
        $image = str_replace(' ', '+', $image);

        $imageName = Str::random(10) . '.' . $extension;
        Storage::disk('public')->put('photos/' . $imageName, base64_decode($image));

        Photo::create([
            'user_id' => auth()->id(),
            'path' => 'photos/' . $imageName,
        ]);

        return redirect()->back()->with('message', 'Photo saved!');
    }

    /**
     * Export final strip to gallery
     */
    public function export(Request $request)
    {
        $request->validate([
            'image' => 'required|string',
        ]);

        $image_64 = $request->image;

        // Extract extension from data URL
        preg_match('/data:image\/(\w+);base64,/', $image_64, $matches);
        $extension = $matches[1] ?? 'png';

        // Remove data URL prefix
        $image = preg_replace('/data:image\/\w+;base64,/', '', $image_64);
        $image = str_replace(' ', '+', $image);

        // Generate unique filename
        $imageName = 'strip_' . Str::random(10) . '.' . $extension;

        // Save to storage
        Storage::disk('public')->put('photos/' . $imageName, base64_decode($image));

        // Save to database with type 'strip'
        Photo::create([
            'user_id' => auth()->id(),
            'path' => 'photos/' . $imageName,
            'type' => 'strip',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Strip saved to your archive!',
            'path' => 'photos/' . $imageName,
        ]);
    }
}
