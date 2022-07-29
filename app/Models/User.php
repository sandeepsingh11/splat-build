<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    private int $id;
    private string $email;
    private string $password;
    private string $createdAt;
    private string $updatedAt;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function gears()
    {
        return $this->hasMany(Gear::class);
    }

    public function gearsets()
    {
        return $this->hasMany(Gearset::class);
    }

    protected function setUser(User $user) {
        $this->id = $user['id'];
        $this->email = $user['email'];
        $this->password = $user['password'];
        $this->createdAt = $user['created_at'];
        $this->updatedAt = $user['updated_at'];
    }

    /**
     * Get the most recent gears created for this user.
     * 
     * @param number $numOfGears number of gears to retrieve
     * 
     * @return Illuminate\Database\Eloquent\Collection
     */
    public function getRecentGears($numOfGears = 3)
    {
        if (!isset($this->id)) {
            $this->setUser(Auth::user());
        }

        $gears = Gear::where('user_id', $this->id)
            ->join('base_gears', 'base_gears.id', 'gears.base_gear_id')
            ->latest('gears.created_at')
            ->limit($numOfGears)
            ->select(
                'gears.id as gear_id',
                'gear_title',
                'gear_desc',
                'base_gear_id',
                'gears.created_at',
                'gears.updated_at',
                'base_gear_name',
                'base_gear_type',
            )
            ->get();

        // get skills for each gear
        $gears->transform(function ($gear) {
            $skills = Gear::where('gears.id', $gear->gear_id)
                ->join('gear_skill', 'gear_skill.gear_id', 'gears.id')
                ->join('skills', 'skills.id', 'gear_skill.skill_id')
                ->select(
                    'skill_type',
                    'skill_name',
                    'is_main',
                    'skill_id as id'
                )
                ->orderBy('skill_type', 'asc')
                ->get();
            $gear['skills'] = $skills;
            
            return $gear;
        });

        return $gears;
    }

    /**
     * Get the most recent gearsets created for this user.
     * 
     * @param number $numOfGearsets number of gearsets to retrieve
     * 
     * @return Illuminate\Database\Eloquent\Collection
     */
    public function getRecentGearsets($numOfGearsets = 3)
    {
        $recentGearsets = $this->gearsets()
            ->latest()
            ->limit($numOfGearsets)
            ->get();
        
        return $recentGearsets;
    }

    function getGearStats()
    {
        if (!isset($this->id)) {
            $this->setUser(Auth::user());
        }

        $headCount = $this->getGearCount('H');
        $clothesCount = $this->getGearCount('C');
        $shoesCount = $this->getGearCount('S');
        $gearTotal = $this->getGearCount();
        $gearsetTotal = $this->getGearsetCount();

        return [
            'head' => $headCount,
            'clothes' => $clothesCount,
            'shoes' => $shoesCount,
            'gears' => $gearTotal,
            'gearsets' => $gearsetTotal
        ];
    }

    /**
     * Get the user's gear count.
     * 
     * @param string $gearType get count of a specific gear type ['H', 'C', 'S']
     * 
     * @return int
     */
    public function getGearCount($gearType = '')
    {
        $gearTypes = ['H', 'C', 'S'];

        if ( (!empty($gearType)) && (in_array(strtoupper($gearType), $gearTypes)) ) {
            // get all of user's gears of a specific type        
            $count = Gear::where('user_id', $this->id)
                ->join('base_gears', 'gears.base_gear_id', '=', 'base_gears.id')
                ->where('base_gears.base_gear_type', $gearType)
                ->count();
        }
        else {
            // get all of user's gears
            $count = Gear::where('user_id', $this->id)
                ->join('base_gears', 'gears.base_gear_id', '=', 'base_gears.id')
                ->count();
        }

        return $count;
    }

    public function getGearsetCount()
    {
        return Gearset::where('user_id', $this->id)->count();
    }
}
