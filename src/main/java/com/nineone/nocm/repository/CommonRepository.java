package com.nineone.nocm.repository;

import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public interface CommonRepository {

    boolean insert(Map<String, ?> map);
    boolean update (Map<String,?> map);
    boolean delete (Map<String,?> map);
}
