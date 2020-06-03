package com.nineone.nocm.repository;

import java.util.Map;

import com.nineone.nocm.domain.Task;

public interface TaskRepository {

	int insertTask(Task task);
	int deleteTask(int id);
	int updateTaskContent(Task task);
	int updateTaskPositionByInsert(Task task);
	int updateTaskPositionByDelete(Task task);
	int moveTaskPosition(Map<String,Object> map);
	int updateTaskPosition(Map<String,Object> map);
	int moveTaskPositionByDelete(Map<String,Object> map);
	int moveTaskPositionByinsert(Map<String,Object> map);

}
