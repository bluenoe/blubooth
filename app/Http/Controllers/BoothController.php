<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class BoothController extends Controller
{
    public function index()
    {
        // Trả về giao diện React tên là "Booth/Index"
        return Inertia::render('Booth/Index');
    }
}