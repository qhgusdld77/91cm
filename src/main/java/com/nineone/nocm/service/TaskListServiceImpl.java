package com.nineone.nocm.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import com.nineone.nocm.domain.TaskList;
import com.nineone.nocm.repository.TaskListRepository;
import com.nineone.nocm.util.DateUtil;

@Service
public class TaskListServiceImpl implements TaskListService {
	
	@Autowired
	private TaskListRepository taskListRepository;

	@Override
	public boolean insertTaskList(TaskList taskList) {
		return (taskListRepository.insertTaskList(taskList) > 0 )? true: false;
	}

	@Override
	@Transactional(isolation = Isolation.SERIALIZABLE)
	public boolean deleteTaskList(TaskList taskList) {
		taskListRepository.updateTaskListPositionByDelete(taskList);
		return (taskListRepository.deleteTaskList(taskList.getId()) > 0 )? true: false;
	}

	@Override
	public boolean updateTaskListName(TaskList taskList) {
		Date edit_date = DateUtil.makeDate();
		taskList.setEdit_date(edit_date);
		return (taskListRepository.updateTaskListName(taskList) > 0 )? true: false;
	}

	@Override
	public List<TaskList> getTaskList(int channel_id) {
		return taskListRepository.getTaskList(channel_id);
	}

	@Override
	@Transactional(isolation = Isolation.SERIALIZABLE)
	public boolean updateTaskListPosition(Map<String, Object> map) {
		boolean isUp = (int)map.get("tasklistNewIndex") < (int)map.get("tasklistOldIndex") ? true : false;
		map.put("isUp", isUp);
		taskListRepository.moveTaskListPosition(map);
		return (taskListRepository.updateTaskListPosition(map) > 0)? true: false;
	}
	
	

}
