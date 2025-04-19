<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\StaffSeeder;
use Database\Seeders\StudentSeeder;
use Database\Seeders\BookSeeder;
use Database\Seeders\BorrowingSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            StaffSeeder::class,
            StudentSeeder::class,
            BookSeeder::class,
            BorrowingSeeder::class,
        ]);
    }
}