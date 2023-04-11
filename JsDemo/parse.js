;(function(window, self, globalThis) {
  with (window) {
      ;"use strict";
      !function(t, e) {
          function r(t) {
              return Object.prototype.toString.call(t).match(/\[object (.*?)\]/)[1]
          }
          function a(t) {
              for (var e = atob(t.split(",")[1]), r = t.split(",")[0].split(":")[1].split(";")[0], a = new ArrayBuffer(e.length), n = new Uint8Array(a), c = 0; c < e.length; c++)
                  n[c] = e.charCodeAt(c);
              return new Blob([a],{
                  type: r
              })
          }
          function n(t) {
              function n(t) {
                  return new Promise(function(r, a) {
                      e.ajax({
                          url: "https://imgservice.csdn.net/direct/v1.0/image/upload",
                          type: "get",
                          contentType: "application/json",
                          data: {
                              type: s,
                              rtype: u,
                              "x-image-template": d,
                              "x-image-app": l,
                              "x-image-dir": i,
                              "x-image-suffix": t.type.split("/")[t.type.split("/").length - 1]
                          },
                          xhrFields: {
                              withCredentials: !0
                          },
                          success: function(e) {
                              if (200 === e.code && e.data) {
                                  var n = e.data
                                    , o = new FormData
                                    , i = {
                                      key: "" + n.filePath,
                                      policy: n.policy,
                                      OSSAccessKeyId: n.accessId,
                                      success_action_status: 200,
                                      signature: n.signature,
                                      callback: n.callbackUrl,
                                      file: t
                                  };
                                  for (var l in i)
                                      Object.hasOwnProperty.call(i, l) && o.set(l, i[l]);
                                  c(o, n.host, r, a)
                              } else
                                  a(e)
                          },
                          error: function(t) {
                              a(t)
                          }
                      })
                  }
                  )
              }
              function c(t, r, a, n) {
                  e.ajax({
                      url: r,
                      type: "post",
                      contentType: !1,
                      processData: !1,
                      dataType: "json",
                      mimeType: "multipart/form-data",
                      data: t,
                      xhrFields: {
                          withCredentials: !0
                      },
                      success: function(t) {
                          a(t)
                      },
                      error: function(t) {
                          n(t)
                      }
                  })
              }
              var o, i = t.dir, l = t.app, s = t.type, u = t.rtype, p = t.url || "", d = t.templatename || "";
              return p && (t.file = a(t.url)),
              o = "FileList" !== r(t.file) && "Array" !== r(t.file) ? [t.file] : Array.prototype.slice.call(t.file),
              function(t) {
                  return Promise.all(t.map(function(t) {
                      return n(t)
                  }))
              }(o)
          }
          function c(t) {
              var e = unescape(encodeURIComponent(t));
              return o(e, e.length, l)
          }
          function o(t, e, r) {
              var a, n = "";
              for (a = 0; a <= e - 3; a += 3)
                  n += r.charAt(t.charCodeAt(a) >>> 2),
                  n += r.charAt((3 & t.charCodeAt(a)) << 4 | t.charCodeAt(a + 1) >>> 4),
                  n += r.charAt((15 & t.charCodeAt(a + 1)) << 2 | t.charCodeAt(a + 2) >>> 6),
                  n += r.charAt(63 & t.charCodeAt(a + 2));
              return e % 3 == 2 ? (n += r.charAt(t.charCodeAt(a) >>> 2),
              n += r.charAt((3 & t.charCodeAt(a)) << 4 | t.charCodeAt(a + 1) >>> 4),
              n += r.charAt((15 & t.charCodeAt(a + 1)) << 2),
              n += s) : e % 3 == 1 && (n += r.charAt(t.charCodeAt(a) >>> 2),
              n += r.charAt((3 & t.charCodeAt(a)) << 4),
              n += s,
              n += s),
              n
          }
          function i(t) {
              var e = 0;
              if (t.length > 0)
                  for (var r = 0; r < t.length; r++) {
                      var a = t.charAt(r);
                      a.match(/[\u4E00-\u9FFF]/) && e++
                  }
              return e
          }
          t.csdn = t.csdn || {};
          var l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
            , s = "=";
          n.addWatermark = function(t) {
              var e = t.url
                , r = t.watermark
                , a = t.width
                , n = i("CSDN @" + r)
                , o = ("CSDN @" + r).length + n;
              r = c("CSDN @" + r);
              var l = Math.round((a - 32) / 2 / o) <= 0 ? 1 : Math.round((a - 32) / 2 / o);
              return l = l > 20 ? 20 : l,
              e + "?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_" + r + ",size_" + l + ",color_FFFFFF,t_70,g_se,x_16"
          }
          ,
          n.dataURItoBlob = a,
          t.csdn.uploadSource = n
      }(window, jQuery);
      //# sourceURL=https://g.csdnimg.cn/upload-img/1.0.6/upload-img.js
  }
}
).bind(window.proxy)(window.proxy, window.proxy, window.proxy);
