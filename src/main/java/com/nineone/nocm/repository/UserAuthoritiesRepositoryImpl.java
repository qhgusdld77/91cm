package com.nineone.nocm.repository;

import com.nineone.nocm.domain.Authorities;
import com.nineone.nocm.domain.User;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

@Repository
public class UserAuthoritiesRepositoryImpl implements UserAuthoritiesRepository {

    @Autowired
    private SqlSessionTemplate sqlSession;

    private String namespace = "com.nineone.nocm.mapper.authorities";

    @Override
    public List<String> getUserRoles(String email) {
        return sqlSession.selectList(namespace + ".getUserAuthority", email);
    }

    @Override
    public int insertAuthority(Authorities authorities) {
        return sqlSession.insert(namespace+".insertAuthority", authorities);
    }

    @Override
    public int deleteAllAuthority(String email) {
        return sqlSession.delete(namespace+".deleteAllAuthority",email);
    }

    @SuppressWarnings("rawtypes")
	@Override
    public List<HashMap> getRoleUserList(User user) {
    	List<String> roles = user.getRoles();
    	String role = roles.get(0);
    	String level = role.equals("ROLE_ROOT")?"0":"1";
        return sqlSession.selectList(namespace + ".getRoleUserList", level);
    }
}
