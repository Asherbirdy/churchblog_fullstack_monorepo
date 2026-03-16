### 新增文章(未上線過)
   步驟一: 使用者新增文章
	  - status: "offline"
		- setStatus: "offline"
		- isEdit: true
    - editedHtml: ""
		- onlineHtml: ""
		- previousHtml: ""

	步驟一之二: 寫文章內容
	  - status: "offline"
		- setStatus: "offline"
		- isEdit: true
    - editedHtml: "<div>第一次發文</div>"
		- onlineHtml: ""
		- previousHtml: ""

   步驟二: 安排排程
		- status: "offline"
		- setStatus: "scheduledOnline"
		- isEdit: true
    - editedHtml: "<div>第一次發文</div>"
		- onlineHtml: "<div>第一次發文</div>"
		- previousHtml: ""
	步驟三:	取消排程
		- status: "offline"
		- setStatus: "offline"
		- isEdit: true
    - editedHtml: "<div>第一次發文</div>"
		- onlineHtml: ""
		- previousHtml: ""
  步驟四: 再安排上線
		- status: "offline"
		- setStatus: "scheduledOnline"
		- isEdit: true
    - editedHtml: "<div>第一次發文</div>"
		- onlineHtml: "<div>第一次發文</div>"
		- previousHtml: ""
	步驟四: 前端打包上線
		- status: "online"
		- setStatus: "none"
		- isEdit: false
    - editedHtml: "<div>第一次發文</div>"
		- onlineHtml: "<div>第一次發文</div>"
		- previousHtml: ""
----------------------------------------------------------------------

### 文章更改並上線
	步驟一: 使用者編輯文章並按下儲存
		- status: "online"
		- setStatus: "none"
		- isEdit: true
    - editedHtml: "<div>更改文章 第一次</div>"
		- onlineHtml: "<div>第一次發文</div>"
		- previousHtml: ""
	步驟二: 取消更改，回到一一個紀錄
		- status: "online"
		- setStatus: "none"
		- isEdit: false
    - editedHtml: "<div>第一次發文</div>"
		- onlineHtml: "<div>第一次發文</div>"
		- previousHtml: ""
	步驟三: 又編輯文章
		- status: "online"
		- setStatus: "none"
		- isEdit: true
    - editedHtml: "<div>更改文章 第二次</div>"
		- onlineHtml: "<div>第一次發文</div>"
		- previousHtml: ""
	步驟四: 安排時程上線
		- status: "online"
		- setStatus: "scheduledOnline"
		- isEdit: true
    - editedHtml: "<div>更改文章 第二次</div>"
		- onlineHtml: "<div>更改文章 第二次</div>"
		- previousHtml: "<div>第一次發文</div>"
	步驟五: 取消時程上線
		- status: "online"
		- setStatus: "none"
		- isEdit: true
    - editedHtml: "<div>更改文章 第二次</div>"
		- onlineHtml: "<div>第一次發文</div>"
		- previousHtml: ""
	步驟六: 再按排上線
		- status: "online"
		- setStatus: "scheduledOnline"
		- isEdit: true
    - editedHtml: "<div>更改文章 第二次</div>"
		- onlineHtml: "<div>更改文章 第二次</div>"
		- previousHtml: "<div>第一次發文</div>"
	步驟七: 前端打包上線
		- status: "online"
		- setStatus: "none"
		- isEdit: false
    - editedHtml: "<div>更改文章 第二次</div>"
		- onlineHtml: "<div>更改文章 第二次</div>"
		- previousHtml: ""
----------------------------------------------------------------------

### 文章安排下線
	步驟一: 安排下線
		- status: "online"
		- setStatus: "scheduledOffline"
		- isEdit: false
    - editedHtml: "<div>更改文章 第二次</div>"
		- onlineHtml: "<div>更改文章 第二次</div>"
		- previousHtml: ""
	
	步驟二: 前端打包下線(打包前會先打個api改變status)
		- status: "offline"
		- setStatus: "none"
		- isEdit: false
    - editedHtml: "<div>更改文章 第二次</div>"
		- onlineHtml: "<div>更改文章 第二次</div>"
		- previousHtml: ""