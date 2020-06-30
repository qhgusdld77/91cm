package com.nineone.nocm.repository;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.nineone.nocm.domain.Channel;
import com.nineone.nocm.domain.Message;

@Repository
public class MessageRepositoryImpl implements MessageRepository {
	
	@Autowired
    private SqlSessionTemplate sqlSession;

	private String namespace = "com.nineone.nocm.mapper.message";
	
	@Override
	public int insertMessage(Message msg) {
		return sqlSession.insert(namespace + ".insertMessage",msg);
	}

	@Override
	public List<Message> getMessageList(Map<String, Object> map) {
		return sqlSession.selectList(namespace + ".getMessageList",map);
	}

	@Override
	public List<Integer> getMsgCntList(List<Channel> list) {
		return sqlSession.selectList(namespace + ".getMsgCntList", list);
	}


	@Override
	public int updateDeleteYN(int id) {
		return sqlSession.update(namespace + ".updateDeleteYN",id);
	}

}
