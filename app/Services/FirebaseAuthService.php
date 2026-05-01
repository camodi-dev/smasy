<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\JWK;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class FirebaseAuthService
{
    private string $projectId;

    public function __construct()
    {
        $this->projectId = config('services.firebase.project_id');
    }

    public function verifyIdToken(string $idToken): array
    {
        $publicKeys = Cache::remember('firebase_public_keys', 3600, function () {
            $response = Http::get(
                'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
            );
            return $response->json();
        });

        $keys = JWK::parseKeySet(['keys' => $this->formatKeys($publicKeys)]);

        $decoded = JWT::decode($idToken, $keys);
        $payload = (array) $decoded;

        if ($payload['aud'] !== $this->projectId) {
            throw new \Exception('Invalid audience');
        }

        if ($payload['iss'] !== "https://securetoken.google.com/{$this->projectId}") {
            throw new \Exception('Invalid issuer');
        }

        return $payload;
    }

    private function formatKeys(array $certs): array
    {
        return collect($certs)->map(function ($cert, $kid) {
            return [
                'kty' => 'RSA',
                'kid' => $kid,
                'x5c' => [str_replace([
                    '-----BEGIN CERTIFICATE-----',
                    '-----END CERTIFICATE-----',
                    "\n"
                ], '', $cert)],
            ];
        })->values()->toArray();
    }
}