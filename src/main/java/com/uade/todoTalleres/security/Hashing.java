package com.uade.todoTalleres.security;

import java.util.function.Function;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Hashing {
    private static final Logger log = LoggerFactory.getLogger(Hashing.class);

    // This should be updated every year or two.
    private static final UpdatableBCrypt bcrypt = new UpdatableBCrypt(11);

    public static String hash(String password) {
        return bcrypt.hash(password);
    }

    public static boolean verifyAndUpdateHash(String password, String hash, Function<String, Boolean> updateFunc) {
        return bcrypt.verifyAndUpdateHash(password, hash, updateFunc);
    }

    public static boolean verifyHash(String password, String hash){
        return bcrypt.verifyHash(password, hash);
    }
}