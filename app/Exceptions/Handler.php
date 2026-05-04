<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {});
    }

    public function render($request, Throwable $e)
    {
        $response = parent::render($request, $e);

        if (!app()->environment('local') && in_array($response->getStatusCode(), [404, 403, 500])) {
            return $this->renderInertiaError($response->getStatusCode());
        }

        // Show Inertia errors in all environments for HTTP exceptions
        if ($e instanceof HttpException && in_array($e->getStatusCode(), [404, 403, 500])) {
            return $this->renderInertiaError($e->getStatusCode());
        }

        return $response;
    }

    private function renderInertiaError(int $status): \Illuminate\Http\Response
    {
        $page = match($status) {
            404 => 'Errors/NotFound',
            403 => 'Errors/Forbidden',
            500 => 'Errors/ServerError',
            default => 'Errors/ServerError',
        };

        return Inertia::render($page)
            ->toResponse(request())
            ->setStatusCode($status);
    }
}