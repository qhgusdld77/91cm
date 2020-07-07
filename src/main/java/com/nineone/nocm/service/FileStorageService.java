package com.nineone.nocm.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.nineone.nocm.domain.ContentsFile;
import com.nineone.nocm.domain.User;
import com.nineone.nocm.exception.FileStorageException;
import com.nineone.nocm.exception.UploadFileNotFoundException;
import com.nineone.nocm.repository.FileStorage;
import com.nineone.nocm.util.DateUtil;

import net.coobird.thumbnailator.Thumbnailator;
import net.coobird.thumbnailator.Thumbnails;

@Service
public class FileStorageService {
	private final String USER_IMAGE_PATH = "C:/userImage/";
    private final Path fileStorageLocation;

    @Autowired
	private UserService userService;
    @Autowired
    private FileStorage fileStorage;

    @Autowired
    public FileStorageService() {
        this.fileStorageLocation = Paths.get("C:/Attach").toAbsolutePath().normalize();
        try{
            Files.createDirectories(this.fileStorageLocation);
        }catch (Exception ex){
        	throw new FileStorageException("could not create the directory",ex);
        }
    }
    
    public Path makeDateDirectories(String parentsDirName) {
    	String dirName = new SimpleDateFormat("yyyyMMdd").format(DateUtil.makeDate());
    	String srtPath = "C:/Attach/"+parentsDirName+"/"+dirName;
    	Path path = Paths.get(srtPath).toAbsolutePath().normalize();
    	try {
			Files.createDirectories(path);
			return path;
		} catch (Exception ex) {
			throw new FileStorageException("could not create the directory",ex);
		}
    }
    
    public void makeThumnail(Path path,MultipartFile file,ContentsFile contentsFile) {
    	
    	String thumbPath = path.resolve("thumb"+contentsFile.getServer_name()).toString();
//    	File thumbFile = new File(path.toString(), "thumb" + contentsFile.getServer_name());
//    	file.transferTo(thumbFile);
    	
    	try {
//    		Thumbnailator.createThumbnail(file.getInputStream(),);
			Thumbnails.of(file.getInputStream()).scale(0.25).toFile(thumbPath);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
    
    public Path checkExtension(MultipartFile file,ContentsFile contentsFile) {
    	Path path;
    	switch (contentsFile.getExtension()) {
		case "zip":
		case "7z" :
		case "tar":
			path = makeDateDirectories("zip");
			break;
		case "png":
		case "jpg":
		case "JPEG":
		case "gif":
			path = makeDateDirectories("image");
			makeThumnail(path,file,contentsFile);
			break;
		case "pdf":
			path = makeDateDirectories("pdf");
			break;
		case "txt":
			path = makeDateDirectories("txt");
			break;
		default:
			path = makeDateDirectories("else");
			break;
		}
    	return path;
    }
    
    public String storeFile(MultipartFile file, ContentsFile contentsFile){
        String fileName = StringUtils.cleanPath(contentsFile.getServer_name()+"."+contentsFile.getExtension());
        
        Path path = checkExtension(file,contentsFile);
        
        try{
            if (fileName.contains("..")){
                throw new FileStorageException("Sorry! Filename contains invalid path sequenced "+ fileName);
            }
            Path targetLocation = path.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return path.toString();
        }catch (IOException ex){
            throw new FileStorageException("Could not store file "+ fileName + ", please try again",ex);
        }
    }
    
    public String storeFile(MultipartFile file, User user){
		String fileName = StringUtils.cleanPath("u-"+getUUID());
		Path filePath = null;
		Path UserImageStorageLocation = null;
		try{
			if (fileName.contains("..")){
				throw new FileStorageException("Sorry! Filename contains invalid path sequenced "+ fileName);
			}
			UserImageStorageLocation = Paths.get(USER_IMAGE_PATH).toAbsolutePath().normalize();
			Files.createDirectories(UserImageStorageLocation);
			filePath = UserImageStorageLocation.resolve(fileName);
			Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
			deleteOldUserPicture(user.getPicture().replace("/api/file/download/",""));
			user.setPicture("/api/file/download/"+fileName);
			userService.userinfoUpdate(user);
			return fileName;
		}catch (IOException ex){
			throw new FileStorageException("Could not store file "+ fileName + ", please try again",ex);
		}
	}
    
    public Resource loadFileAsResource(String fileName){
        try{
        	Path filePath = null;
        	Path UserImageStorageLocation = null;
        	if(fileName.contains("u-")) {
        		UserImageStorageLocation = Paths.get(USER_IMAGE_PATH).toAbsolutePath().normalize();
        		filePath = UserImageStorageLocation.resolve(fileName).normalize();
        	}else {
        		ContentsFile file = fileStorage.getFile(fileName.replace("thumb", ""));
        		Path path = Paths.get(file.getPath()).toAbsolutePath().normalize();
        		filePath = path.resolve(fileName+"."+file.getExtension()).normalize();
        	}
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()){
                return  resource;
            }else{
                throw new UploadFileNotFoundException("File not found : "+fileName);
            }
        } catch (MalformedURLException ex) {
            throw new UploadFileNotFoundException("File not found : "+fileName, ex);
        }
    }
    
    public void DBStoreFile(ContentsFile file){
        fileStorage.saveFile(file);
    }
    
	public void deleteOldUserPicture(String fileName) throws RuntimeException{
		File file = new File(USER_IMAGE_PATH+fileName);
		if (file.exists()){
			file.delete();
		}
	}
	
    public String getUUID(){
        return UUID.randomUUID().toString().replaceAll("-","");
    }

    public String download(String sourceUrl) {
		FileOutputStream fos = null;
		String targetFilename = "u-"+ getUUID();
		InputStream is = null;
		String path = "C:/userImage/"; //폴더 경로
		File Folder = new File(path);

		if (!Folder.exists()) {
			try{
			    Folder.mkdir(); //폴더 생성합니다.
			    System.out.println("폴더가 생성되었습니다.");
		        }
		        catch(Exception e){
			    e.getStackTrace();
			}
	    }
		try {
			fos = new FileOutputStream(path + targetFilename);

			URL url = new URL(sourceUrl);
			URLConnection urlConnection = url.openConnection();
			is = urlConnection.getInputStream();
			byte[] buffer = new byte[1024];
			int readBytes;
			while ((readBytes = is.read(buffer)) != -1) {
				fos.write(buffer, 0, readBytes);
			}
			return targetFilename;
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			return null;
		} catch (MalformedURLException e) {
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		} finally {
			try {
				if (fos != null) {
					fos.close();
				}
				if (is != null) {
					is.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}