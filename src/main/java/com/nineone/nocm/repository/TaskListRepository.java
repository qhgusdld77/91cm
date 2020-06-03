package com.nineone.nocm.repository;

import java.util.List;
import java.util.Map;

import com.nineone.nocm.domain.TaskList;

public interface TaskListRepository {
	int insertTaskList(TaskList taskList);
	int deleteTaskList(int id);
	int updateTaskListPositionByDelete(int position);
	int updateTaskListName(TaskList taskList);
	List<TaskList> getTaskList(int channel_id);
	int moveTaskListPosition(Map<String,Object> map);
	int updateTaskListPosition(Map<String,Object> map);
}
