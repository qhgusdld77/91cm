package com.nineone.nocm.repository;

import com.nineone.nocm.domain.ContentsFile;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class FileStorage {

    @Autowired
    private SqlSessionTemplate sqlSession;

    private String namespace = "com.nineone.nocm.mapper.file";

    public int saveFile(ContentsFile file){
        return sqlSession.insert(namespace + ".saveFile",file);
    }

    public ContentsFile getFile(String server_name) {
    	return sqlSession.selectOne(namespace + ".getFile", server_name);
    }

    public List<ContentsFile> getChannelFileList(int channel_id){
        return sqlSession.selectList(namespace+".getChannelFileList",channel_id);
    }

}
