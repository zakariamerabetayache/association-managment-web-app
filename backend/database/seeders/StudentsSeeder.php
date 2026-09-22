<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class StudentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create('ar_SA'); // Arabic locale for realistic names
        
        // Get existing residence IDs from database
        $residenceIds = DB::table('residences')->pluck('id')->toArray();
        $douIds = DB::table('dous')->pluck('id')->toArray();
        $pavillonIds = DB::table('pavillons')->pluck('id')->toArray();
        $chambreIds = DB::table('chambres')->pluck('id')->toArray();
        
        // If no data exists, create some default IDs
        if (empty($residenceIds)) $residenceIds = [1, 2, 3];
        if (empty($douIds)) $douIds = [1, 2, 3, 4, 5];
        if (empty($pavillonIds)) $pavillonIds = [1, 2, 3, 4];
        if (empty($chambreIds)) $chambreIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        
        $students = [];
        $batchSize = 100; // Insert in batches for better performance
        
        echo "Generating 1000 fake students...\n";
        
        for ($i = 1; $i <= 1000; $i++) {
            // Generate Arabic names
            $arabicFirstNames = [
                'محمد', 'أحمد', 'علي', 'حسن', 'حسين', 'عبدالله', 'عبدالرحمن', 'خالد', 'سعد', 'فهد',
                'عمر', 'يوسف', 'إبراهيم', 'عبدالعزيز', 'سلمان', 'فيصل', 'ناصر', 'طارق', 'وليد', 'مشعل',
                'فاطمة', 'عائشة', 'خديجة', 'مريم', 'زينب', 'سارة', 'نور', 'هند', 'رقية', 'أسماء',
                'نوال', 'سعاد', 'منى', 'ليلى', 'رانيا', 'دينا', 'ريم', 'شيماء', 'إيمان', 'هدى'
            ];
            
            $arabicLastNames = [
                'الأحمد', 'المحمد', 'العلي', 'الحسن', 'الخالد', 'السعد', 'الفهد', 'العمر', 'اليوسف',
                'الإبراهيم', 'العبدالله', 'الناصر', 'الطارق', 'الوليد', 'المشعل', 'الفيصل', 'السلمان',
                'العتيبي', 'الغامدي', 'القحطاني', 'العنزي', 'الدوسري', 'الشهري', 'الزهراني', 'الحربي',
                'المطيري', 'العسيري', 'الرشيد', 'البلوي', 'الجهني', 'السبيعي', 'الثقفي', 'البقمي'
            ];
            
            $firstName = $arabicFirstNames[array_rand($arabicFirstNames)];
            $lastName = $arabicLastNames[array_rand($arabicLastNames)];
            
            // Generate registration number (nb_inscription)
            $year = rand(2020, 2024);
            $registrationNumber = $year . str_pad($i, 6, '0', STR_PAD_LEFT);
            
            $students[] = [
                'nom_ar' => $lastName,
                'prenom_ar' => $firstName,
                'nom_fr' => $this->transliterateToFrench($lastName),
                'prenom_fr' => $this->transliterateToFrench($firstName),
                'email' => strtolower($this->transliterateToFrench($firstName)) . '.' . 
                          strtolower($this->transliterateToFrench($lastName)) . $i . '@university.edu.dz',
                'password' => Hash::make('password123'),
                'nb_inscription' => $registrationNumber,
                'date_nais' => $faker->dateTimeBetween('-25 years', '-18 years')->format('Y-m-d'),
                'annee_bac' => rand(2018, 2024),
                'sex' => rand(0, 1), // 0 = Male, 1 = Female
                'niveau' => rand(1, 6), // Academic levels 1-6
                'cycle' => rand(0, 6), // Different cycles
                'specialite' => $this->getRandomSpecialty('fr'),
                'adresse' => 'Adresse numero ' . $i . ', Algerie',
                'dou_id' => $douIds[array_rand($douIds)],
                'residence_id' => $residenceIds[array_rand($residenceIds)],
                'trans_residence_id' => rand(0, 1) ? $residenceIds[array_rand($residenceIds)] : null,
                'pavillon_id' => rand(0, 1) ? $pavillonIds[array_rand($pavillonIds)] : null,
                'chambre_id' => rand(0, 1) ? $chambreIds[array_rand($chambreIds)] : null,
                'app_id' => 2,
                'role_id' => 3, // Student role
                'studentState' => rand(0, 10) > 1 ? 1 : 0, // 90% active, 10% inactive
                'renew_state' => rand(0, 2),
                'trans_state' => rand(0, 2),
                'nin' => '19' . rand(80, 99) . rand(10, 12) . rand(10, 48) . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT) . rand(10, 99),
                'etablissement_id' => rand(1, 5),
                'domain_id' => rand(1, 10),
                'filiere_id' => rand(1, 20),
                'created_at' => now(),
                'updated_at' => now(),
            ];
            
            // Insert in batches
            if ($i % $batchSize == 0) {
                DB::table('users')->insert($students);
                $students = [];
                echo "Inserted batch: " . ($i / $batchSize) . "/10\n";
            }
        }
        
        // Insert remaining students
        if (!empty($students)) {
            DB::table('users')->insert($students);
        }
        
        echo "Successfully created 1000 fake students!\n";
    }
    
    private function transliterateToFrench($arabicName)
    {
        $transliterations = [
            'محمد' => 'Mohamed',
            'أحمد' => 'Ahmed',
            'علي' => 'Ali',
            'حسن' => 'Hassan',
            'حسين' => 'Hussein',
            'عبدالله' => 'Abdullah',
            'عبدالرحمن' => 'Abderrahmane',
            'خالد' => 'Khaled',
            'سعد' => 'Saad',
            'فهد' => 'Fahd',
            'عمر' => 'Omar',
            'يوسف' => 'Youssef',
            'إبراهيم' => 'Ibrahim',
            'عبدالعزيز' => 'Abdelaziz',
            'سلمان' => 'Salman',
            'فيصل' => 'Faisal',
            'ناصر' => 'Nasser',
            'طارق' => 'Tarek',
            'وليد' => 'Walid',
            'مشعل' => 'Mishaal',
            'فاطمة' => 'Fatima',
            'عائشة' => 'Aicha',
            'خديجة' => 'Khadija',
            'مريم' => 'Meriem',
            'زينب' => 'Zeinab',
            'سارة' => 'Sara',
            'نور' => 'Nour',
            'هند' => 'Hind',
            'رقية' => 'Rokia',
            'أسماء' => 'Asma',
            'الأحمد' => 'Ahmed',
            'المحمد' => 'Mohamed',
            'العلي' => 'Ali',
            'الحسن' => 'Hassan',
            'الخالد' => 'Khaled',
            'السعد' => 'Saad',
            'الفهد' => 'Fahd',
            'العمر' => 'Omar',
            'اليوسف' => 'Youssef',
            'الإبراهيم' => 'Ibrahim',
            'العتيبي' => 'Otaibi',
            'الغامدي' => 'Ghamdi',
            'القحطاني' => 'Qahtani',
            'العنزي' => 'Anzi',
            'الدوسري' => 'Dosari',
            'الشهري' => 'Shahri',
            'الزهراني' => 'Zahrani',
            'الحربي' => 'Harbi',
        ];
        
        return $transliterations[$arabicName] ?? 'Student';
    }
    
    private function getRandomSpecialty($lang)
    {
        $specialties = [
            'ar' => [
                'علوم الحاسوب', 'الهندسة المدنية', 'الطب', 'الصيدلة', 'الحقوق',
                'الاقتصاد', 'الأدب العربي', 'التاريخ', 'الجغرافيا', 'الرياضيات',
                'الفيزياء', 'الكيمياء', 'البيولوجيا', 'الهندسة الكهربائية', 'الهندسة الميكانيكية'
            ],
            'fr' => [
                'Informatique', 'Genie Civil', 'Medecine', 'Pharmacie', 'Droit',
                'Economie', 'Litterature Arabe', 'Histoire', 'Geographie', 'Mathematiques',
                'Physique', 'Chimie', 'Biologie', 'Genie Electrique', 'Genie Mecanique'
            ]
        ];
        
        return $specialties[$lang][array_rand($specialties[$lang])];
    }
    
    private function getRandomWilaya($lang)
    {
        $wilayas = [
            'ar' => [
                'الجزائر', 'وهران', 'قسنطينة', 'عنابة', 'باتنة', 'سطيف', 'سيدي بلعباس',
                'بسكرة', 'تلمسان', 'ورقلة', 'بجاية', 'تيزي وزو', 'المسيلة', 'الوادي'
            ],
            'fr' => [
                'Alger', 'Oran', 'Constantine', 'Annaba', 'Batna', 'Setif', 'Sidi Bel Abbes',
                'Biskra', 'Tlemcen', 'Ouargla', 'Bejaia', 'Tizi Ouzou', 'Msila', 'El Oued'
            ]
        ];
        
        return $wilayas[$lang][array_rand($wilayas[$lang])];
    }
}
