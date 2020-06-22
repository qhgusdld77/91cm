package com.nineone.nocm.repository;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.nineone.nocm.domain.User;

@Repository
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private SqlSessionTemplate sqlSession;

    private String namespace = "com.nineone.nocm.mapper.user";

	@Override
	public int insertUser(User user) {
		return sqlSession.insert(namespace + ".insertUser", user);
	}
	
	

	@Override
	public User getUserfindById(String id) {
		return sqlSession.selectOne(namespace + ".getUserfindById", id);
	}


	@Override
	public int userInfoUpdate(User user) {
		return sqlSession.update(namespace+".updateUser",user);
	}

	@Override
	public List<User> thisChannelUserList(int channel_id) {
		return sqlSession.selectList(namespace + ".thisChannelUserList",channel_id);
	}

	@Override
	public int insertSNSInfo(Map<String, Object> map) {
		return sqlSession.insert(namespace + ".insertSNSInfo", map);
	}


    @Override
    public List<User> getAllUserList() {
        return sqlSession.selectList(namespace +".getAllUserList");
    }
    
    @Override
    public User getUserfindByEmail(String email) {
        return sqlSession.selectOne(namespace + ".getUserfindByEmail", email);
    }



	@Override
	public List<User> getUserListForInvite(int channel_id) {
		return sqlSession.selectList(namespace + ".getUserListForInvite", channel_id);
	}



//	@Override
//	public boolean isNotExistEmail(String email) {
//		return sqlSession.selectOne(namespace + ".isNotExistEmail", email);
//	}



}
