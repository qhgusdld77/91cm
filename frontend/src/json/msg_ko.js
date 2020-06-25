export default {
    "member":{
        "err":{
            "enterEmail": "이메일을 입력해주세요",    /* member.err.enterEmail */
            "enterName": "이름을 입력해주세요",     /* member.err.enterName */  
            "longName": "이름이 너무 깁니다.",     /* member.err.longName */
            "enterPhone": "핸드폰 번호를 입력해주세요",     /* member.err.enterPhone */ 
            "incorrectPhone": "핸드폰 번호가 형식에 맞지 않습니다",     /* member.err.incorrectPhone */
            "existingEmail": "해당 이메일은 이미 가입되어 있습니다.",     /* member.err.existingEmail */
        }
    },
    "file":{
        "err":{
            "fileSizeLimit":"한번에 보낼 수 있는 파일 용량은 100MB 입니다.",     /* file.err.fileSizeLimit */
            "folderNotAllowd": "폴더는 업로드 할 수 없습니다."     /* file.err.folderNotAllowd */
        }
    },
    "common": {
        "err": {
        },
        "msg": {
            "enterCtn": "내용을 입력해주세요."     
        },
        "btn": {
            "save": "저장",    /* common.btn.save */
            "cancel": "취소",    /* common.btn.cancel */
            "modify": "수정",    /* common.btn.modify */
            "ok": "확인",    /* common.btn.ok */
            "delete": "삭제",    /* common.btn.delete */
		    "leave": "나가기"    /* common.btn.leave */
        },
        "menu": {
            
        },
        "txt":{
            "label":{
                "name": "이름",     /* common.txt.label.name */
                "email": "이메일",     /* common.txt.label.email */
                "phone": "핸드폰번호"     /* common.txt.label.phone */
            }
        },
        "desc": {
        
        }
    },

    "admin": {
        "err": {
            "authModFail": "권한 수정에 실패했습니다."     /* admin.err.authModFail */
        },
        "msg":{
            "authModSuccess": "권한이 수정되었습니다."     /* admin.msg.authModSuccess */
        },
        "txt": {
            "tab": {
                "authSetting": "권한설정",     /* admin.txt.tab.authSetting */
                "sendMessageToAll": "전체메세지"    /* admin.txt.tab.sendMessageToAll */
            },
            "auth": {
                "title" : "사용자 리스트",  /* admin.txt.auth.title */
                "col":{
                    "num": "번호",    /* admin.txt.auth.col.num */
                    "name": "이름",     /* admin.txt.auth.col.name */
                    "email": "이메일",  /* admin.txt.auth.col.email */
                    "authority": "권한",    /* admin.txt.auth.col.authority */
                    "modify": "수정"    /* admin.txt.auth.col.modify */
                }
            }
        }
    },
    "main":{
        "txt":{
            "header":{
                "noti":{
                    "title": "Notification" /* main.txt.header.noti.title */
                },
                "menu":{
                    "profile": '프로필',    /* main.txt.header.menu.profile */
                    "logout": '로그아웃',   /* main.txt.header.menu.logout */
                    "adminPage": '관리자페이지' /* main.txt.header.menu.adminPage */
                }
            },
            "sidebar":{
                "r":{
                    "title":"About this Channel",   /* main.txt.sidebar.r.title */
                    "menu":{
                        "channelDetails":{         /* main.txt.sidebar.r.menu.channelDetails */
                            "name":"채널 세부사항",     /* main.txt.sidebar.r.menu.channelDetails.name */
                            "label": "Channel Name",        /* main.txt.sidebar.r.menu.channelDetails.label */
                       },
                       "videoChat":{
                        "name":"화상 채팅",            /* main.txt.sidebar.r.menu.videoChat.name */
                        "label": "화상 채팅 유저 수",
                        "btn":{
                            "join": "입장",
                            "leave": "나가기"
                           }
                       },
                       "todoList":{
                        "name":"할 일"				
                       },
                       "calendar":{
                        "name": "캘린더"
                       }
                   }
                },
                "l":{
                    "menu":{
                        "channls":"채널",
                        "Users":"사용자"
                   }
                }
               }
            
        }
    },
    
    "join": {
        "oauth": {
            "err": {
                "joinFail": "회원가입 실패"     /* join.oauth.err.joinFail */
            },
            "msg": {
            
            },
            "txt": {
                "title": "91cm를 사용하기 위해 추가적으로 필요한 정보를 입력해주세요",  /* join.oauth.txt.title */
                "emailLabel": "가입할 이메일을 입력해주세요",   /* join.oauth.txt.emailLabel */
                "nameLabel": "91cm에서 사용할 이름을 입력해주세요",    /* join.oauth.txt.nameLabel */
                "phoneLabel": "업무에 사용하는 핸드폰 번호를 입력해주세요"      /* join.oauth.txt.phoneLabel */
            },
            "desc": {
            }
        },
        "form": {
            "err": {
                "incorrectEmail": "올바른 이메일 주소가 아닙니다.",           /* join.form.err.incorrectEmail */
                "enterAll": "모든 항목을 채워주세요.",      /* join.form.err.enterAll */
                "emailCheck": "이메일 중복확인을 해주세요.",          /* join.form.err.emailCheck */
                "incorrectPwd": "비밀번호가 일치하지 않습니다."           /* join.form.err.incorrectPwd */
            },
            "msg": {
                "availableEmail": "사용가능한 이메일입니다."          /* join.form.msg.availableEmail */
            },
            "txt": {
            
            }
        },
        "btn": {
            "submit": "등록"          /* join.form.btn.submit */
        }
    },
    
    "login": {
        "err": {
            
        },
        "msg": {
            
        },
        "btn": {
            "login": "로그인"          /* join.form.btn.login */
        }
    
    },
    "channel":{
            "txt":{
                "channelNameLabel": "채널 이름",          /* channel.txt.channelNameLabel */
                "createTitle":"채널 생성",          /* channel.txt.createTitle */
                "updateTitle": "채널 수정"          /* channel.txt.updateTitle */
            },
            "msg":{
                "deleteMsg": "<code>{txt1}</code>채널을 삭제하시겠습니까?",           /* channel.msg.deleteMsg */
                "forceLeaveMsg":"{txt1} 채널에서 추방되었습니다.",           /* channel.msg.forceLeaveMsg */
                "leaveMsg": "{txt1} 채널에서 나갔습니다.",           /* channel.msg.leaveMsg */
                "leaveMsg2": "{txt1} 채널에서 {txt2} 나갔습니다."       //나중에 지우기
            },
            "err":{
                "forceLeaveFail":"추방에 실패했습니다.",           /* channel.err.forceLeaveFail */
                "leaveFail": "나가기에 실패했습니다."           /* channel.err.leaveFail */
            }
    },

    "todolist":{
        "title": "Taskboard",            /* todolist.title */ //todolist와 taskboard 하나로 통일해야할 것 같음
        "desc":{
            //"enterCtn": "내용을 입력해주세요.",            /* todolist.desc.enterCtn common.msg에 같은 글있음 */
            "enterDt": "날짜를 입력해주세요"        /* todolist.desc.enterDt */
        },
        "taskList":{	
            "create":{
                "label":"리스트 생성"         /* todolist.taskList.create.label */
            },
            "update":{
            
            },
            "delete":{
            
            }
        },
        "task":{
            "create":{
                
            },
            "menu":{
                "done":"완료",            /* todolist.task.menu.done */
                "revoke": "취소"          /* todolist.task.menu.revoke */
            }
        },
        "err":{
            "posUpdateFail":"위치 변경에 실패했습니다."     /* todolist.err.posUpdateFail */
            }
    
    },
    "calendar":{
        "txt":{
            "month":"", 
            "year":"",  
            "modal":{
                "title":"일정 수정",     /* calendar.txt.modal.title */
                "taskTitle":"일정 이름",    /* calendar.txt.modal.taskTitle */
                "taskCtn": "일정 내용",    /* calendar.txt.modal.taskCtn */
                "desc": {
                    "evtTitle": "캘린더 이벤트 제목"    /* calendar.txt.modal.desc.evtTitle */
                }
            }
        }
    },
    "chat":{
        "desc":{
            "chatTextarea": "채팅 메세지를 입력하세요."    /* chat.desc.chatTextarea */
        },
        "msg":{
            "sendEmail": "지금부터 보내는 메시지는 {txt1} 채널 사용자들에게 메일로 보내집니다."    /* chat.msg.sendEmail */
        }
    },
    
    "invite":{
        "txt":{
            "userSelectLabel": "선택"   /* invite.txt.userSelectLabel */
        },
        "err":{
            "existingInvite":"{arr}은 이미 이 채널에 초대받았습니다. 확인해주세요."   /* invite.err.existingInvite */
        },
        "msg":{
            "selectUser":"초대할 사용자를 선택해주세요"    /* invite.msg.selectUser */
        }
    },
    
    "profile":{
        "txt":{
            "title":"개인프로필",    /* profile.txt.title */
            "updateTitle": "개인 프로필 수정"       /* profile.txt.updateTitle */
        },
        "err":{
            "imagesNotAllowed": "이미지 파일만 업로드 할 수 있습니다."       /* profile.err.imagesNotAllowed */
        }
    }
}