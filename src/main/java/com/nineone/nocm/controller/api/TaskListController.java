package com.nineone.nocm.controller.api;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.nineone.nocm.domain.TaskList;
import com.nineone.nocm.service.TaskListService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/tasklist")
public class TaskListController {
	
	@Autowired
	private TaskListService taskListService; 
	
	@RequestMapping(value="/insert", method = RequestMethod.POST)
	public TaskList insertTaskList(@RequestBody TaskList taskList) {
		if (taskListService.insertTaskList(taskList)){
			return taskList;
		}
		// 다른 Exception 처리 필요
		return null;
	}
	
	// PathVariable을 Post 방식에서 사용하는것이 괜찮은지 알아봐야 할듯
	@RequestMapping(value="/delete", method=RequestMethod.POST)
	public boolean deleteTaskList(@RequestBody TaskList taskList) {
		return taskListService.deleteTaskList(taskList);
	}
	
	@RequestMapping(value="/update/name",method=RequestMethod.POST)
	public boolean updateTaskListName (@RequestBody TaskList taskList) {
		return taskListService.updateTaskListName(taskList);
	}
	
	@RequestMapping(value="/get/{channel_id}",method=RequestMethod.GET)
	public List<TaskList> getTaskList(@PathVariable int channel_id) {
		return taskListService.getTaskList(channel_id);
	}
	
	@RequestMapping(value="/update/position",method=RequestMethod.POST)	
	public boolean updateTaskListPostion(@RequestBody Map<String, Object> map) {
		// 필요한 값 : 드래그앤드랍하기 전에 리스트의 인덱스 값과 드래그앤드랍 이후의 해당 리스트의 인덱스값, 해당 리스트의 id 값
		// tasklistOldIndex, tasklistNewIndex,tasklistId 
		
		try {
			return taskListService.updateTaskListPosition(map);
		} catch (Exception e) {
			return false;
		}
		
	}

}
