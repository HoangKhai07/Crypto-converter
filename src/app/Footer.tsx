
'use client';
import { useState } from 'react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-100 py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-4 md:mb-0">
                        <p className="font-medium">Cryptocurrency Converter</p>
                        <p className="text-sm text-gray-600">
                            Convert between crypto currencies instantly
                        </p>
                    </div>

                    <div className="text-sm text-gray-600">
                        <p>Email: support@cryptoconverter.com</p>
                        <p>Twitter: @CryptoConvertApp</p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t text-center text-gray-500">
                    © {currentYear} Crypto Converter. All rights reserved.
                </div>
            </div>
        </footer>
    );
}