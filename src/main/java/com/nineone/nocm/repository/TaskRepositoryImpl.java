package com.nineone.nocm.repository;

import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.nineone.nocm.domain.Task;

@Repository
public class TaskRepositoryImpl implements TaskRepository {

	@Autowired
    private SqlSessionTemplate sqlSession;

	private String namespace = "com.nineone.nocm.mapper.task";

	@Override
	public int insertTask(Task task) {
		return sqlSession.insert(namespace + ".insertTask",task);
	}

	@Override
	public int updateTaskPositionByInsert(Task task) {
		//새로운 task 삽입에 의해 position을 update를 해주어야할 때
		return sqlSession.update(namespace + ".updateTaskPositionByInsert",task);
	}


	@Override
	public int deleteTask(int id) {
		return sqlSession.delete(namespace + ".deleteTask", id);
	}

	@Override
	public int updateTaskPositionByDelete(Task task) {
		// 기존 task 삭제에 의해 position을 update 해주어야할 때
		return sqlSession.update(namespace + ".updateTaskPositionByDelete",task);
	}

	@Override
	public int updateTaskContent(Task task) {
		return sqlSession.update(namespace + ".updateTaskContent",task);
	}

	@Override
	public int moveTaskPosition(Map<String, Object> map) {
		// 같은 리스트안에서 task의 position을 바꿀 때
		// 사용자가 어떤 한 task의 position을 바꿈으로 인해 다른 task들의 position을 update 해주어야 할 때
		return sqlSession.update(namespace + ".moveTaskPosition",map);
	}

	@Override
	public int updateTaskPosition(Map<String, Object> map) {
		//같은 리스트안에서 task의 position을 바꿀 때 또는 특정 리스트 속 task를 다른 리스트 task로 옮길 때 실행되는 쿼리
		//사용자가 옮긴 task의 position을 update 해 줄 때
		return sqlSession.update(namespace + ".updateTaskPosition",map);
	}

	@Override
	public int moveTaskPositionByDelete(Map<String, Object> map) {
		// 특정 리스트 속 task를 다른 리스트 task로 옮길 때
		// 영향받는 다른 task들의 position을 update해줄 때
		return sqlSession.update(namespace + ".moveTaskPositionByDelete",map);
	}

	@Override
	public int moveTaskPositionByinsert(Map<String, Object> map) {
		// 특정 리스트 속 task를 다른 리스트 task로 옮길 때
		// 영향받는 다른 task들의 position을 update해줄 때
		return sqlSession.update(namespace + ".moveTaskPositionByinsert",map);
	}

}
