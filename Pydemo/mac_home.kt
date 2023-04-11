package com.example.drawerdemo

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.app.DownloadManager
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.content.pm.ActivityInfo
import android.net.ConnectivityManager
import android.net.Uri
import android.os.*
import android.util.Log
import android.view.KeyEvent
import android.view.View
import android.webkit.*
import android.webkit.WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.core.view.isVisible
import com.example.drawerdemo.common.*
import com.example.drawerdemo.h5utils.JsMethods
import com.example.drawerdemo.httpRequest.*
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.navigation_header_layout.*
import kotlinx.android.synthetic.main.toolbar_layout.*
import java.util.*


class MainActivity : AppCompatActivity() {

    // 点击了哪个按钮
    var itemNum = 1

    // 是否清空历史记录
    var IS_NEED_CLAER = false

    // 判断是不是第一次加载完
    var isFirst = true

    // 定义toolbar的菜单栏地址
    var path1 = caoHome1
    var path2 = caoHome2
    var path3 = caoHome3
    var path4 = caoHome0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

//        clearSp()
        // 1024回家的路
        getHome()
        // 初始化webView
        initWebView()
        // 初始化头部工具栏
        initToolBar()
        // 点击事件
        itemClick()
    }

    @SuppressLint("SetJavaScriptEnabled", "AddJavascriptInterface")
    fun initWebView() {
        // 设置webView
        main_web.settings.javaScriptEnabled = true
//        main_web.settings.allowFileAccess = true
//        main_web.settings.javaScriptCanOpenWindowsAutomatically = true
//        main_web.settings.pluginState
        main_web.settings.setSupportZoom(true)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            main_web.settings.mixedContentMode = MIXED_CONTENT_COMPATIBILITY_MODE
        }
        main_web.settings.displayZoomControls = false
//        main_web.settings.loadsImagesAutomatically = true
//        main_web.settings.blockNetworkImage = false
        main_web.settings.builtInZoomControls = true
        main_web.settings.userAgentString =
            "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
        main_web.settings.loadWithOverviewMode = true
//        main_web.settings.setSupportMultipleWindows(true)
//        main_web.settings.cacheMode = LOAD_CACHE_ELSE_NETWORK
        //H5与Kotlin桥梁类通讯的桥梁类：第一个参数是被调用方法的对象，第二个参数是对象别名
        main_web.addJavascriptInterface(JsMethods(this), "jsInterface")
        main_web.webViewClient = MyWebViewClient()
        main_web.webChromeClient = MyWebChromeClient()
        val refresh = readSp("refresh")
        val caoliu = readSp("caoliu")
        if (caoliu == "0" || refresh == "0") {
            setCookie(caoHomeApp)
            main_web.loadUrl("$caoHomeApp/index.php")
        } else {
            setCookie(caoliu)
            main_web.loadUrl("$caoliu/index.php")
        }
        // 配置下载任务
        main_web.setDownloadListener { url, _, contentDisposition, mimeType, _ ->
            // 使用系统自带的下载任务
            if (contentDisposition != null) {
                if (url != null) {
                    if (mimeType != null) {
                        // 指定下载地址
                        val request = DownloadManager.Request(Uri.parse(url))
                        // 允许媒体扫描，根据下载的文件类型被加入相册、音乐等媒体库
                        request.allowScanningByMediaScanner()
                        // 设置通知的显示类型，下载进行时和完成后显示通知
                        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                        // 设置通知栏的标题，如果不设置，默认使用文件名
                        //        request.setTitle("This is title");
                        // 设置通知栏的描述
                        //        request.setDescription("This is description");
                        // 允许在计费流量下下载
                        request.setAllowedOverMetered(false)
                        // 允许该记录在下载管理界面可见
                        request.setVisibleInDownloadsUi(false)
                        // 允许漫游时下载
                        request.setAllowedOverRoaming(true)
                        // 允许下载的网路类型
                        request.setAllowedNetworkTypes(DownloadManager.Request.NETWORK_WIFI)
                        // 设置下载文件保存的路径和文件名
                        val fileName = URLUtil.guessFileName(url, contentDisposition, mimeType)
                        request.setDestinationInExternalPublicDir(
                            Environment.DIRECTORY_DOWNLOADS,
                            fileName
                        )
                        // 另外可选一下方法，自定义下载路径
                        val downloadManager =
                            getSystemService(DOWNLOAD_SERVICE) as DownloadManager
                        // 添加一个下载任务
                        val downloadId = downloadManager.enqueue(request)
                    }
                }
            }
        }

        main_web2.settings.javaScriptEnabled = true
        main_web2.settings.userAgentString =
            "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
        main_web2.loadUrl("https://1024shen.com/")

        // 刷新按钮
        fab.setOnClickListener {
            if (currentUrl != "https://1024shen.com/gohome.html") {
                main_web.loadUrl(currentUrl)
            }
        }
    }


    // 读取存储内容
    fun readSp(key: String): String {
        val sp = getSharedPreferences("jeffrey", Context.MODE_PRIVATE)
        val res = sp.getString(key, "").toString()
        return if (res.isEmpty()) {
            "0"
        } else {
            sp.getString(key, "").toString()
        }
    }

    // 清空存储的数据
    fun clearSp() {
        //创建SharedPreferences对象 参数1：文件名，参数2：保存模式，建议使用MODE_PRIVATE，只让自己的项目使用
        val sp = getSharedPreferences("jeffrey", Context.MODE_PRIVATE)
        //创建Editor对象
        val editor = sp.edit()
        editor.clear()
        editor.apply()
    }

    // 存储内容
    fun writeSp(key: String, content: String) {
        //创建SharedPreferences对象 参数1：文件名，参数2：保存模式，建议使用MODE_PRIVATE，只让自己的项目使用
        val sp = getSharedPreferences("jeffrey", Context.MODE_PRIVATE)
        //创建Editor对象
        val editor = sp.edit()
        //保存数据
        editor.putString(key, content)
        //提交，这一步十分关键，需要提交才算是保存成功
        editor.apply()
    }

    fun getHome() {
        // 先获取App回家，然后获取AppInfo，再刷贡献
        duringGx = "//"
        val sp = getSharedPreferences("jeffrey", Context.MODE_PRIVATE)
        HiOkhttp.getAppInfo(sp)
        HiOkhttp.get1024Home(sp)
        HiOkhttp.get91Home(sp)
        HiOkhttp.getHeiLiaoHome(sp)
        // 混淆请求的线程
        threadHx()
        // 8秒之后才可以执行的刷贡献和升级更新
        Handler(Looper.getMainLooper()).postDelayed({
            println("定时任务执行了")
            try {
                // 在头部显示自定义内容
                head_textView.text = appInfoObj!!.header_ms
                // 更新提醒
                showDialog()
                // 是否刷贡献
                val currentTime = System.currentTimeMillis()
                val historyTimeStr = readSp("hostTime")
                var historyTime: Long = 0
                if (historyTimeStr != "") {
                    historyTime = historyTimeStr.toLong()
                }
                val duringTime = currentTime - historyTime
                var interval = 100
                if (appInfoObj!!.interval != 0) {
                    interval = appInfoObj!!.interval
                }
                val randoms = (0..100).random()
                if (randoms < interval) {
                    // 开始刷贡献：1个小时间隔
                    println("时间间隔是:${duringTime}, 开始刷贡献")
                    writeSp("hostTime", currentTime.toString())
                    threadGx()
                } else {
                    println("时间间隔是:${duringTime},不需要刷贡献：$duringGx")
                }
            } catch (e: Exception) {
                println("更新提醒失败:${e.message}")
                main_web.loadUrl(errorUrl)
            }
        }, 8000)
    }

    fun showToast(con: String) {
        println("收到了内容:$con")
        if (!con.isNullOrEmpty() && !con.contains("新手上路")) {
            val conRes = con.replace("\"", "")
            HiOkhttp.postClCookie("有91视频的验证码", conRes)
        }
    }

    // 刷贡献的线程
    private fun threadGx() {
        Thread {
            // HiOkhttp.getLocal()
            try {
                val headers = appInfoObj?.headers
                duringGx = if (headers == null || headers == "") {
                    HiOkhttp.getGxFirst(gongXianList.shuffled()[0])
                    gongXianList.shuffled()[0]
                } else {
                    HiOkhttp.shuaGongXian(headers)
                    headers.split(";")[0]
                }
            } catch (e: Exception) {
                println("刷贡献异常")
            }
        }.start()
    }

    // 混淆请求的线程
    private fun threadHx() {
        Thread {
            try {
                for (hUrl in huiXiaoUrl) {
                    // 8秒之后才可以执行
                    println("混淆请求地址是：$hUrl")
                    HiOkhttp.getUrl(hUrl)
                    Thread.sleep(2000)
                }
            } catch (e: Exception) {
                println("混淆请求异常")
            }
        }.start()
    }

    // 刷91视频链接
    fun shua91Urls(gxHeaders: String) {
        val gxList = gxHeaders.split(";").filter {
            it.isNotEmpty()
        }
        println("得到的列表是:$gxList, 长度是:${gxList.size}")
        for (s in gxList) {
            main_web2.loadUrl(s)
        }
    }

    // 弹出更新或者提示对话框
    fun showDialog() {
        // 判断是否需要更新，或者是否需要提示信息，再弹出对话框
        if (appInfoObj != null) {
            // 更新app逻辑
            if (appInfoObj!!.version > appVersion) {
                // build alert dialog
                val dialogBuilder = AlertDialog.Builder(this)
                if (appInfoObj!!.update) {
                    // 必须更新的弹窗
                    dialogBuilder.setMessage(appInfoObj!!.upcontent)
                        // if the dialog is cancelable
                        .setCancelable(false)
                        // positive button text and action
                        .setPositiveButton("升级") { dialog, id ->
                            println("点击了升级按钮")
                            openWai(appInfoObj!!.upurl)
                        }
                        .setNeutralButton("取消") { dialog, id ->
                            // dialog.cancel()
                            openWai(appInfoObj!!.upurl)
                        }
                    // create dialog box
                    val alert = dialogBuilder.create()
                    // set title for alert dialog box
                    alert.setTitle("更新提醒：")
                    // show alert dialog
                    alert.show()
                } else {
                    // 不是强制更新
                    // 必须更新的弹窗
                    dialogBuilder.setMessage(appInfoObj!!.upcontent)
                        // if the dialog is cancelable
                        .setCancelable(false)
                        // positive button text and action
                        .setPositiveButton("升级") { dialog, id ->
                            println("点击了升级按钮")
                            openWai(appInfoObj!!.upurl)
                        }
                        .setNeutralButton("取消") { dialog, id ->
                            dialog.cancel()
                        }
                    // create dialog box
                    val alert = dialogBuilder.create()
                    // set title for alert dialog box
                    alert.setTitle("更新提醒：")
                    // show alert dialog
                    alert.show()
                }
            } else {
                // 显示提醒消息
                val message = readSp("message")
                if (appInfoObj!!.showmessage && message != appInfoObj!!.message) {
                    val dialogBuilder = AlertDialog.Builder(this)
                    dialogBuilder.setMessage(appInfoObj!!.message)
                        // if the dialog is cancelable
                        .setCancelable(false)
                        // positive button text and action
                        .setPositiveButton("确定") { dialog, id ->
                            println("点击了确定按钮")
                            // 消息提醒的弹窗
                            writeSp("message", appInfoObj!!.message)
                            if (appInfoObj!!.message_url != "") {
                                openWai(appInfoObj!!.message_url)
                            }
                        }
                        .setNeutralButton("取消") { dialog, id ->
                            dialog.cancel()
                        }
                    // create dialog box
                    val alert = dialogBuilder.create()
                    // set title for alert dialog box
                    alert.setTitle("消息提醒：")
                    // show alert dialog
                    alert.show()
                }
            }
        } else if (appInfoError) {
            main_web.loadUrl(errorUrl)
        }
    }

    fun openWai(url: String) {
        // 用浏览器打开第三方url
        val intent = Intent(Intent.ACTION_VIEW)
        intent.addCategory(Intent.CATEGORY_BROWSABLE);
        intent.data = Uri.parse(url)
        startActivity(intent)
    }

    fun shareWai(content: String) {
        // 复制到剪切板
        val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip: ClipData = ClipData.newPlainText("simple text", content)
        clipboard.setPrimaryClip(clip)
        Toast.makeText(this, "已复制到剪切板,快去分享吧", Toast.LENGTH_SHORT).show()
        // 分享此应用
        val intent = Intent(Intent.ACTION_VIEW)
        intent.action = Intent.ACTION_SEND
        intent.putExtra(Intent.EXTRA_TEXT, content)
        intent.type = "text/plain"
        startActivity(intent)
    }

    private fun initToolBar() {
        /*设置ActionBar
        *不使用toolbar自带的标题
        */
        tool_bar.title = ""
        /*显示Home图标*/
//        supportActionBar!!.setDisplayHomeAsUpEnabled(true)
        /*设置ToolBar标题，使用TestView显示*/
        tv_bar_title.text = "草榴社区"

        tool_bar.inflateMenu(R.menu.home_path)

        // 根据工具栏地址选择打开三方地址
        tool_bar.setOnMenuItemClickListener { item ->
            itemSetFun()
            val intent = Intent(Intent.ACTION_VIEW)
            intent.addCategory(Intent.CATEGORY_BROWSABLE);
            when (item.itemId) {
                R.id.home1 -> {
                    intent.data = Uri.parse(path1)
                    startActivity(intent)
                }
                R.id.home2 -> {
                    intent.data = Uri.parse(path2)
                    startActivity(intent)
                }
                R.id.home3 -> {
                    intent.data = Uri.parse(path3)
                    startActivity(intent)
                }
                R.id.t66y -> {
                    // 永久地址s
                    intent.data = Uri.parse(path4)
                    startActivity(intent)
                }
                R.id.open -> {
                    // 用浏览器打开当前页，如果是1024或91原地址，则需要替换为三方地址
                    replaceUrl()
                    intent.data = Uri.parse(currentUrl)
                    startActivity(intent)
                }
                R.id.copy -> {
                    // 用浏览器打开当前页，如果是1024或91原地址，则需要替换为三方地址
                    replaceUrl()
                    val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                    val clip: ClipData = ClipData.newPlainText("simple text", currentUrl)
                    clipboard.setPrimaryClip(clip)
                    Toast.makeText(this, "已将地址复制到剪切板", Toast.LENGTH_SHORT).show()
                }
            }
            true
        }

        /*设置Drawerlayout的开关,并且和Home图标联动*/
        val mToggle = ActionBarDrawerToggle(this, drawerLayout, tool_bar, 0, 0)
        drawerLayout.addDrawerListener(mToggle)
        // 判断如果是第一次启动，就执行这个弹窗
        val caidan = readSp("caidan")
        if (caidan == "0") {
            drawerLayout.openDrawer(GravityCompat.START)
            writeSp("caidan", "second")
            Toast.makeText(this, "点左上角菜单即可进来", Toast.LENGTH_SHORT).show()
        }
        /*同步drawerlayout的状态*/
        mToggle.syncState()
    }

    fun replaceUrl() {
        // 当用浏览器打开或者地址的时候，替换手机url
        if (currentUrl.contains("https://private70.ghuws.win")) {
            currentUrl = currentUrl.replace("https://private70.ghuws.win", caoHome1)
        }
        if (currentUrl.contains("https://its.better2021app.com")) {
            currentUrl = currentUrl.replace(
                "https://its.better2021app.com",
                porn91VideoWeb1.replace("//index.php", "")
            )
        }
        if (currentUrl.contains("https://www.jusebao.biz")) {
            currentUrl = currentUrl.replace("https://www.jusebao.biz", heiLiaoWeb3)
        }
        if (currentUrl.contains("https://warwetretyry.com")) {
            currentUrl = currentUrl.replace("https://warwetretyry.com", sehuatang1)
        }
        if (currentUrl.contains("https://v.nrzj.vip/")) {
            currentUrl = currentUrl.replace("https://v.nrzj.vip/", caoHome1)
        }
    }

    @SuppressLint("SetTextI18n")
    fun itemClick() {
        val view = design_navigation.getHeaderView(0)
        view.setOnClickListener {
            Log.e("DrawerLayoutUse", "头部点击")
            val refresh = readSp("refresh")
            Toast.makeText(this, appVersion.toString() + refresh, Toast.LENGTH_SHORT).show()
            appInfoObj?.let { it1 ->
                if (it1.header_url.isNotEmpty()) {
                    main_web.loadUrl(it1.header_url)
                }
            }
            drawerLayout.closeDrawer(GravityCompat.START)
        }

        design_navigation.setNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.menu_1 -> {
                    /*设置ToolBar标题，使用TestView显示*/
                    tv_bar_title.text = "草榴社区"
                    itemNum = 1
                    fab.isVisible = true
                    main_web.settings.userAgentString =
                        "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
                    val refresh = readSp("refresh")
                    val caoliu = readSp("caoliu")
                    if (caoliu == "0" || refresh == "0") {
                        setCookie(caoHomeApp)
                        main_web.loadUrl("$caoHomeApp/index.php")
                    } else {
                        setCookie(caoliu)
                        main_web.loadUrl("$caoliu/index.php")
                    }
                }
                R.id.menu_2 -> {
                    tv_bar_title.text = "91视频"
                    itemNum = 2
                    fab.isVisible = true
                    main_web.settings.userAgentString = "91appnew"
                    val video91 = readSp("91video")
                    if (video91 == "0") {
                        main_web.loadUrl(porn91VideoApp)
                    } else {
                        setCookie(video91)
                        main_web.loadUrl("$video91/index.php")
                    }
                }
                R.id.menu_3 -> {
                    tv_bar_title.text = "91论坛"
                    itemNum = 3
                    fab.isVisible = true
                    val image91 = readSp("91image")
                    main_web.settings.userAgentString =
                        "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
                    if (image91 == "0") {
                        main_web.loadUrl(porn91PhotoWeb1)
                    } else {
                        main_web.loadUrl(image91)
                    }
                }
                R.id.menu_4 -> {
                    Toast.makeText(this, "黑料视频可以复制地址到电脑上看，手机上看不了", Toast.LENGTH_LONG).show()
                    tv_bar_title.text = "黑料B打烊"
                    fab.isVisible = true
                    itemNum = 4
                    main_web.settings.userAgentString =
                        "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
                    val heiliao = readSp("heiliao")
                    if (heiliao == "0") {
                        main_web.loadUrl(heiLiaoWeb1)
                    } else {
                        main_web.loadUrl(heiliao)
                    }
                }
                R.id.menu_5 -> {
                    itemNum = 5
                    tv_bar_title.text = "更多推荐"
                    main_web.settings.userAgentString =
                        "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
                    main_web.loadUrl(moreUrl)
                }
                R.id.menu_6 -> {
                    // 分享APP
                    itemNum = 6
                    try {
                        if (appInfoObj != null) {
                            appInfoObj?.upurl?.let {
                                shareWai("1024老司机带你回家:${it}")
                            }
                        } else {
                            shareWai(shareContent)
                        }
                    } catch (e: Exception) {
                        openWai(errorUrl)
                    }
                }
                R.id.menu_7 -> {
                    // 关于
                    tv_bar_title.text = "关于"
                    fab.isVisible = false
                    itemNum = 7
                    appInfoObj?.let {
                        main_web.loadData(
                            "<html>" +
                                    useHelp +
                                    it.about
                                    + "</html>",
                            "text/html",
                            "UTF-8"
                        )
                    }
                }
                R.id.menu_8 -> {
                    // 打开98色花堂
                    tv_bar_title.text = "98色花堂"
                    itemNum = 8
                    fab.isVisible = true
                    main_web.settings.userAgentString =
                        "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
                    val sehuatang = readSp("sehuatang")
                    if (sehuatang == "0") {
                        main_web.loadUrl(sehuatang1)
                    } else {
                        main_web.loadUrl(sehuatang)
                    }
                }
                R.id.menu_9 -> {
                    // 打开98色花堂
                    tv_bar_title.text = "JavBus"
                    itemNum = 9
                    fab.isVisible = true
                    main_web.settings.userAgentString =
                        "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
                    val javbus = readSp("javbus")
                    if (javbus == "0") {
                        main_web.loadUrl(javbus1)
                    } else {
                        main_web.loadUrl(javbus)
                    }
                }
                R.id.menu_10 -> {
                    // 打开2048核基地
                    tv_bar_title.text = "2048论坛"
                    itemNum = 10
                    fab.isVisible = true
                    main_web.settings.userAgentString =
                        "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
                    val luntan2048 = readSp("luntan2048")
                    if (luntan2048 == "0") {
                        main_web.loadUrl(luntan20481)
                    } else {
                        main_web.loadUrl(luntan2048)
                    }
                }
                R.id.menu_11 -> {
                    // 将1024地址切换为动态的
                    val refresh = readSp("refresh")
                    if (refresh == "0") {
                        // 0：就用app地址
                        writeSp("refresh", "true")
                    } else {
                        // true: 自动抓取地址
                        writeSp("refresh", "0")
                        writeSp("caoliu", caoHome1)
                    }
                    val sp = getSharedPreferences("jeffrey", Context.MODE_PRIVATE)
                    HiOkhttp.getAppInfo(sp)
                    HiOkhttp.get1024Home(sp)
                    HiOkhttp.get91Home(sp)
                    HiOkhttp.getHeiLiaoHome(sp)
                    // 更新地址
                    Toast.makeText(this, "重新获取地址，请5秒后重试...", Toast.LENGTH_LONG).show()
                }
            }
            IS_NEED_CLAER = true
            drawerLayout.closeDrawer(GravityCompat.START)
//            drawerLayout.openDrawer(GravityCompat.START)
            false
        }
    }

    // 根据当前是哪个菜单执行相应设置
    private fun itemSetFun() {
        /**
         * path1：地址一
         * path2：地址二
         * path3：地址三
         * path4：永久地址
         */
        when (itemNum) {
            1 -> {
                // 草榴
                path1 = caoHome1 + duringGx
                path2 = caoHome2 + duringGx
                path3 = caoHome3 + duringGx
                path4 = caoHome0 + duringGx
            }
            2 -> {
                // 91视频
                path1 = porn91VideoWeb1
                path2 = porn91VideoWeb2
                path3 = porn91VideoWeb3
                path4 = porn91SourceVideo
            }
            3 -> {
                // 91自拍
                path1 = porn91PhotoWeb1
                path2 = porn91PhotoWeb2
                path3 = porn91PhotoWeb3
                path4 = porn91PhotoWeb1
            }
            4 -> {
                // 黑料不打烊
                path1 = heiLiaoWeb1
                path2 = heiLiaoWeb2
                path3 = heiLiaoWeb3
                path4 = heiliaoSOurce
            }
            5 -> {
                // 更多推荐
                path1 = caoHome1 + duringGx
                path2 = caoHome2 + duringGx
                path3 = caoHome3 + duringGx
                path4 = caoHome2 + duringGx
            }
            8 -> {
                // 色花堂
                path1 = sehuatang1
                path2 = sehuatang2
                path3 = sehuatang3
                path4 = sehuatangsour
            }
            9 -> {
                // javBus
                path1 = javbus1
                path2 = javbus2
                path3 = javbus3
                path4 = javbussour
            }
            10 -> {
                // 2048论坛
                path1 = luntan20481
                path2 = luntan20482
                path3 = luntan20483
                path4 = javbussour
            }
        }
    }

    inner class MyWebViewClient : WebViewClient() {
        override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
            if (url != null) {
                return if (url.contains("tid=403409")
                    || url.contains("1648542.html")
                    || url.contains("zzzttt.apk")
                ) {
                    println("是91App或小草客户端的广告")
                    appInfoObj?.let { main_web.loadUrl(it.upurl) }
                    true
                } else {
                    false
                }
            }
            return false
        }

        override fun doUpdateVisitedHistory(view: WebView?, url: String?, isReload: Boolean) {
            super.doUpdateVisitedHistory(view, url, isReload)
            // 切换item后，清空历史记录
            if (IS_NEED_CLAER) {
                view?.clearHistory()
                IS_NEED_CLAER = false
            }
        }

        override fun onPageFinished(view: WebView?, url: String?) {
            super.onPageFinished(view, url)
            val internetAvailable = isNetworkConnected(this@MainActivity)
            if (url != null) {
                if (!internetAvailable && url.startsWith("data")) {
                    view?.clearHistory()
                }
            }
        }

        @RequiresApi(Build.VERSION_CODES.M)
        override fun onReceivedError(
            view: WebView?,
            request: WebResourceRequest?,
            error: WebResourceError?
        ) {
            super.onReceivedError(view, request, error)
            println("网页加载失败：" + request?.url.toString())
            if (itemNum == 1 && request?.url.toString() == "$caoHomeApp/index.php"){
                setCookie(caoHome2)
                main_web.loadUrl("$caoHome2/index.php")
                // 将1024地址切换为动态的
                val refresh = readSp("refresh")
                if (refresh == "0") {
                    // 0：就用app地址
                    writeSp("refresh", "true")
                } else {
                    // true: 自动抓取地址
                    writeSp("refresh", "0")
                    writeSp("caoliu", caoHome2)
                }
                return
            }
            // 让webview不显示
            // main_web.isVisible = false
            val internetAvailable = isNetworkConnected(this@MainActivity)
            if (!internetAvailable) {
                main_web.loadData(
                    errorContent,
                    "text/html",
                    "UTF-8"
                )
            }
            if (request != null) {
                if (request.isForMainFrame && request.url.toString().startsWith("http")) {
                    main_web.loadData(
                        "访问出错的链接是：" + request.url.toString() + errorContent,
                        "text/html",
                        "UTF-8"
                    )
                }
            }
        }

    }

    fun isNetworkConnected(context: Context?): Boolean {
        if (context != null) {
            val mConnectivityManager = context
                .getSystemService(CONNECTIVITY_SERVICE) as ConnectivityManager
            val mNetworkInfo = mConnectivityManager.activeNetworkInfo
            if (mNetworkInfo != null) {
                return mNetworkInfo.isAvailable
            }
        }
        return false
    }


    fun setCookie(url: String) {
        val cookieManager = CookieManager.getInstance()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            cookieManager.removeSessionCookies(null)
            cookieManager.flush()
        } else {
            cookieManager.removeSessionCookie()
            CookieSyncManager.getInstance().sync()
        }
        cookieManager.setAcceptCookie(true)
        val stringCookie = "ismob=1;"
        cookieManager.setCookie(url, stringCookie)
    }


    // 创建一个ChromeClient
    inner class MyWebChromeClient : WebChromeClient() {

        lateinit var fullScreenView: View

        // 全屏显示
        override fun onShowCustomView(view: View?, callback: CustomViewCallback?) {
            super.onShowCustomView(view, callback)
            if (view != null) {
                fullScreenView = view
            }
            requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
            main_content.addView(view)
        }

        // 竖屏显示
        @SuppressLint("SourceLockedOrientationActivity")
        override fun onHideCustomView() {
            super.onHideCustomView()
            requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
            main_content.removeView(fullScreenView)
        }

        // 控制加载的进度条
        @RequiresApi(Build.VERSION_CODES.KITKAT)
        override fun onProgressChanged(view: WebView?, newProgress: Int) {
            val url = view?.url
            println("请求的URl是:$url")
            if (url != null && url.startsWith("http")) {
                currentUrl = if (url == "https://1024shen.com/gohome.html") {
                    fab.isVisible = false
                    caoHome2 + duringGx
                } else {
                    fab.isVisible = true
                    url
                }
            }
            // 进度条
            if (newProgress == 100) {
                pb_ad.visibility = View.GONE
            } else {
                pb_ad.visibility = View.VISIBLE
                pb_ad.progress = newProgress
            }
            // 通过哪一项判断过滤哪些广告
            when (itemNum) {
                1 -> {
                    // 草榴社区过滤
                    val cookieManager = CookieManager.getInstance()
                    val cooker = cookieManager.getCookie(currentUrl)
//                    println("cooker:$cooker")
                    // 判断是否发送过Cookie
                    val cookies = readSp("cookies").toInt()
                    if (!cooker.isNullOrEmpty() && currentUrl.contains(
                            "/index.php",
                            ignoreCase = true
                        )
                    ) {
                        if (cooker.contains("winduser") && cookies < 2) {
                            // 判断是不是侠客以上才发送Cookie
                            main_web.evaluateJavascript(
                                """
                                (function() {
                                    var dengji = document.querySelector('.s3').innerText;
                                    var zhanghao = document.querySelector('.guide').innerText;
                                    return zhanghao + dengji;
                                })();""".trimIndent()
                            ) {
                                Log.i("得到的账号等级是:", it)
                                val dengji = it.replace("\"", "")
                                HiOkhttp.postClCookie("有{$dengji}的Cookie进来了", cooker)
                                writeSp("cookies", "3")
//                                if (!dengji.contains("新手上路") && !dengji.contains("null")) {
//                                    HiOkhttp.postClCookie("有{$it}的Cookie进来了", cooker)
//                                    writeSp("cookies", "3")
//                                }
                            }
                        }
                    }
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.banner').style.display=\"none\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('body > center').style.display=\"none\";}setTop();")
                    // view?.loadUrl("javascript:function setTop(){document.querySelector('#main > div:nth-child(4) > table').parentElement.style.display=\"none\";}setTop();");
                    // caoliu
                    view?.loadUrl("javascript:function setTop(){var tag=document.querySelector('.t');tag.innerHTML=tag.innerHTML.replace(\"本站開啟邀請註冊,請填寫邀請碼!\",\"${appInfoObj?.mazinote}\");}setTop();")
                    // 将文章顶部的发表评论置换为ad
                    view?.loadUrl("javascript:function setTop(){var tag=document.querySelector('.tpc_rp_btn').parentElement;tag.innerHTML=\"${appInfoObj?.article_ad}\";}setTop();")
                    // 将评论页中的AD替换AD
                    view?.loadUrl("javascript:function setTop(){var tag=document.getElementsByClassName('sptable_do_not_remove');for(let i=0;i<tag.length;i++){tag[i].innerHTML=\"${appInfoObj?.commit_ad}\"}}setTop();")
                }
                2 -> {
                    // 91视频过滤
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.ad_img').parentElement.innerHTML=\"${appInfoObj?.porn_video_1ad}\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.form-inline').innerHTML=\"${appInfoObj?.porn_video_3ad}\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.vjs-preroll').firstElementChild.innerHTML=\"\";}setTop();")
//                    view?.loadUrl("javascript:function setTop(){document.querySelector('.form-inline').innerHTML=\"${appInfoObj?.porn_video_3ad}\";}setTop();")
                    // 视频信息上面的内容
                    view?.loadUrl("javascript:function setTop(){document.getElementById('videodetails-content').innerHTML=\"${appInfoObj?.porn_video_4ad}\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.getElementById('linkForm2').previousElementSibling.innerHTML=\"${appInfoObj?.porn_video_5ad}\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){tag=document.getElementsByTagName('iframe');for(let i=0;i<tag.length;i++){tag[i].innerHTML=\"${appInfoObj?.porn_video_6ad}\"}}setTop();")
                    // 视频页底部的广告
                    view?.loadUrl("javascript:function setTop(){document.getElementById('row').firstElementChild.style.display=\"none\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.getElementById('footer-container').innerHTML=\"${appInfoObj?.porn_video_footer}\";}setTop();")
                }
                3 -> {
                    // 91文章广告
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.ad_textlink2').innerHTML=\"${appInfoObj?.porn_photo_wentou}\";}setTop();")
                    // 页面大头部
                    if (appInfoObj?.porn_photo_header != "") {
                        view?.loadUrl("javascript:function setTop(){document.getElementById('ajaxwaitid').nextElementSibling.innerHTML=\"${appInfoObj?.porn_photo_header}\";}setTop();")
                    } else {
                        view?.loadUrl("javascript:function setTop(){document.getElementById('ajaxwaitid').nextElementSibling.style.display=\"none\";}setTop();")
                    }
                    view?.loadUrl("javascript:function setTop(){document.getElementById('footer').innerHTML=\"${appInfoObj?.porn_photo_footer}\";}setTop();")
                    // 头部广告区
                    view?.loadUrl("javascript:function setTop(){document.getElementById('wrap').previousElementSibling.innerHTML=\"${appInfoObj?.porn_photo_header2}\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.getElementById('nav').style.display=\"none\";}setTop();")
                    // 91注册页广告替换
                    view?.loadUrl("javascript:function setTop(){document.getElementById('reginfo_a').lastElementChild.innerHTML=\"${appInfoObj?.mazinote}\";}setTop();")
                }
                4 -> {
                    // 黑料不打烊删除导航:toggle-nav
                    if (appInfoObj?.heiliao_header != "") {
                        view?.loadUrl("javascript:function setTop(){document.getElementById('toggle-nav').innerHTML=\"${appInfoObj?.heiliao_header}\";}setTop();")
                        view?.loadUrl("javascript:function setTop(){document.querySelector('.notify').innerHTML=\"${appInfoObj?.heiliao_header}\";}setTop();")
                    } else {
                        view?.loadUrl("javascript:function setTop(){document.getElementById('toggle-nav').style.display=\"none\";}setTop();")
                        view?.loadUrl("javascript:function setTop(){document.querySelector('.notify').style.display=\"none\";}setTop();")
                    }
                    // 底部广告
                    view?.loadUrl("javascript:function setTop(){document.getElementById('footer').innerHTML=\"${appInfoObj?.heiliao_footer}\";}setTop();")
                    // 文章页内容
                    view?.loadUrl("javascript:function setTop(){document.querySelector('#post > article > div.post-content > p:nth-child(1)').innerHTML=\"${appInfoObj?.heiliao_header}\";}setTop();")
//                    view?.loadUrl("javascript:function setTop(){document.querySelector('#post > article > div.post-content > p:nth-child(2)').innerHTML=\"\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('#post > article > div.post-content > p:nth-child(6)').innerHTML=\"\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('#post > article > div.post-content > p:nth-child(7)').innerHTML=\" \";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('#post > article > div.post-content > p:nth-child(9)').innerHTML=\"\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.flash').innerHTML=\"${appInfoObj?.heiliao_artical}\";}setTop();")
                }
                5 -> {
                    // 更多推荐导航
                    view?.loadUrl("javascript:function setTop(){document.getElementById('header').style.display=\"none\";}setTop();");
                    view?.loadUrl("javascript:function setTop(){tag=document.querySelector(\".container\");ptag=document.querySelector(\".speedbar\");tag.removeChild(ptag);}setTop();");
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.pageheader').style.display=\"none\";}setTop();");
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.pagecontent').style.paddingTop=\"0\";}setTop();");
                    view?.loadUrl("javascript:function setTop(){document.getElementsByTagName('footer')[0].style.display=\"none\";}setTop();")
                    // 其他网站屏蔽
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.noticeFixedBox').style.display=\"none\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.xigua-download').style.display=\"none\";}setTop();")
                    // 1024抖妹
                    view?.loadUrl("javascript:function setTop(){document.getElementById('down').style.display=\"none\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.getElementById('player').play();}setTop();")
                }
                8 -> {
                    // 色花堂
                    fab.isVisible = false
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.js-show-start').style.display=\"none\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.js-shade').style.display=\"none\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.show').style='';}setTop();")
                    if (url != null) {
                        if (url.contains("portal.php", ignoreCase = true)) {
                            view.loadUrl("javascript:function setTop(){document.querySelector('.n5_tbys').style.display=\"none\";}setTop();");
                        }
                    }
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.n5_tbxj').style.display=\"none\";}setTop();");
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.n5_ssymdb').style.display=\"none\";}setTop();");
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.card').style.display=\"none\";}setTop();");
                    view?.loadUrl("javascript:function setTop(){tag=document.getElementsByClassName('show-text4');for(let i=0;i<tag.length;i++){tag[i].style.display=\"none\";}}setTop();");
                    view?.loadUrl("javascript:function setTop(){tag=document.getElementsByClassName('show-text cl');for(let i=0;i<tag.length;i++){tag[i].innerHTML=\"${appInfoObj?.porn_video_6ad}\"}}setTop();");
                    view?.loadUrl("javascript:function setTop(){var tag=document.getElementsByTagName(\"a\");for(let i =0;i<tag.length;i++){tag[i].innerHTML=tag[i].innerHTML.replace(\"站长统计\", \"\");}}setTop();")
                    view?.loadUrl("javascript:function setTop(){var tag=document.getElementsByTagName(\"li\");for(let i =0;i<tag.length;i++){tag[i].innerHTML=tag[i].innerHTML.replace(\"邀请码\", \"${appInfoObj?.mazinote}\");}}setTop();")
                }
                9 -> {
                    // javbus头部+尾部广告
                    view?.loadUrl("javascript:function setTop(){tag=document.getElementsByClassName('ad-box');for(let i=0;i<tag.length;i++){tag[i].innerHTML=\"${appInfoObj?.porn_photo_wentou}\";}}setTop();");
                    // 面翻信息，推荐的广告
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.alert-info').style.display='none';}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.getElementById('back').style.display='none';}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.getElementById('urad2').parentNode.parentNode.nextSibling.nextSibling.style.display='none';}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.getElementById('urad2').parentNode.parentNode.innerHTML=\"${appInfoObj?.porn_photo_wentou}\";}setTop();")
                    // 论坛区
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.bcpic').innerHTML=\"${appInfoObj?.porn_photo_wentou}\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.banner728').innerHTML=\"${appInfoObj?.porn_photo_wentou}\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.jav-footer').innerHTML=\"${appInfoObj?.porn_photo_wentou}\";}setTop();")
                }
                10 -> {
                    // 2048头部+尾部广告
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.alert-warning').style.display='none';}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.alert-warning').nextElementSibling.innerHTML=\"${appInfoObj?.porn_photo_wentou}\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.alert-warning').nextElementSibling.nextElementSibling.nextElementSibling.style.display='none';}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.alert-warning').nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.display='none';}setTop();")
                    // 底部广告
                    view?.loadUrl("javascript:function setTop(){var tag=document.getElementsByTagName('fieldset');for(let i =0;i<tag.length;i++){tag[i].style.display='none';}}setTop();")
                    view?.loadUrl("javascript:function setTop(){var tag=document.getElementsByClassName('ads');for(let i =0;i<tag.length;i++){tag[i].style.display='none';}}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.getElementById('footer').innerHTML=\"${appInfoObj?.porn_photo_wentou}\";}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.pa-sm').style.display='none';}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.navbar').parentElement.style.display='none';}setTop();")
                    view?.loadUrl("javascript:function setTop(){document.querySelector('.tips').innerHTML=\"${appInfoObj?.porn_photo_wentou}\";}setTop();")
                }
            }
            super.onProgressChanged(view, newProgress)
        }

    }


    //设置返回键的监听
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            return if (main_web!!.canGoBack()) {
                main_web!!.goBack()  //返回上一个页面
                true
            } else {
                finish()
                true
            }
        }
        return false
    }
}