<?php

class Crypter {

    const Key = "bcD9n0EF2135zwvu224-aGtsyxrqpHUo";
    const Algo = MCRYPT_BLOWFISH;
    const encry = false;

    public function __construct() {
        
    }

    public function encryptString($data) {
        $blocksize = mcrypt_get_block_size('blowfish', 'ecb');
        $pkcs = $blocksize - (strlen($data) % $blocksize);
        $data.= str_repeat(chr($pkcs), $pkcs); 
        $crypt = mcrypt_encrypt(Crypter::Algo, Crypter::Key, $data, MCRYPT_MODE_ECB);
        return rtrim(base64_encode($crypt));
    }

    public function decryptString($data) {
        $crypt = base64_decode($data);
        $iv_size = mcrypt_get_iv_size(Crypter::Algo, MCRYPT_MODE_ECB);
        $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
        $decrypt = mcrypt_decrypt(Crypter::Algo, Crypter::Key, $crypt, MCRYPT_MODE_ECB, $iv);
        $block = mcrypt_get_block_size('blowfish', 'ecb');
        $pad = ord($decrypt[($len = strlen($decrypt)) - 1]);
        return substr($decrypt, 0, strlen($decrypt) - $pad);
    }

}
