$(function(){

//        主评论框点击焦点下拉出提交按钮
    var writeFunctionBlockTpl = template('write-function-block-tpl',{});
    var tan=1;
    $(".new-comment:first textarea").on('focus',function () {
        if(tan){
            tan=0;
            $(".new-comment:first").append(writeFunctionBlockTpl);
            $(".new-comment:first").find('.btn').click(function () {
                $(this).trigger("articleCommentReply");
            })
            $(".new-comment:first").find(".cancel").click(function () {
                $(this).trigger("articleCommentReplyCancel");
            });
            $(".new-comment:first .write-function-block").slideDown();
        };
    })

    $('.comment-list').bind("articleCommentReply",function (e) {
        $.ajax({
            url: "http://localhost/thinkc/public/comment01.json",
            type: 'POST',
            data: {
                name:"duan"
            },
            dataType: 'json',
            success: function (data) {
                var html = template('comment-tpl',{"comments": [data]});
                $("#c-tpl").prepend(html).find(".comment:first").animate({
                    borderColor:"#ce352c",
                    color:"#ce352c"
                }, 100 ).animate({
                    borderColor:"#f0f0f0",
                    color:"#333"
                }, 3000 ).find(".tool-group a").eq(1).on("click",function () {
                    $(this).trigger("mainReply");
                });
                listeningHook($(".comment:first"));

                // listeningHook($("#c-tpl").find(".comment:first"))
            }
        })


    })
    $('.comment-list').bind("articleCommentReplyCancel",function (e) {
        $(".new-comment:first .write-function-block").slideUp(500,function () {
            $(".new-comment:first .write-function-block").remove();
            tan = 1;
        });
    })




//当高度合适并且没有评论和加载块时，开始加载评论
    function watchCommentLoading(){
        var toper = $("#comment-list").offset().top;
        var scroller = $(document).scrollTop()+$(window).height();
        var comments = $("#normal-comment-list").find(".comment").length;
        var placeHolder = $(".comments-placeholder").length;
        if(!comments&&!placeHolder){
            if( toper < scroller){
                ajaxComment();
            }
        }
    }
//        初始化执行一次 保证用户在任何地方刷新都可以加载评论
    watchCommentLoading();

//        监听滚动，计算评论框与顶部距离，如果大于则开始加载评论
    $( window ).scroll(function() {
        watchCommentLoading();
    });

//        加载评论
    function ajaxComment() {
        $.ajax({
            url:"http://localhost/thinkc/public/comment.json",
            type:'POST',
            data:{
                name:'yang',age:25
            },
            beforeSend:function(){
                var htmla = template('placeholder-tpl',{});
                $('#c-tpl').before(htmla);
            },
            dataType:'json',
            success:function(data){
                $(".comments-placeholder").hide();
                var html = template('comment-tpl', data);
                document.getElementById('c-tpl').innerHTML = html;

                hookEvent2();

                // 分页
                var options = {
                    currentPage: data.page,
                    totalPages: data.total_pages,
                    itemTexts: function (type, page, current) {
                        switch (type) {
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "first":
                                return "首页";
                            case "last":
                                return "末页";
                            case "page":
                                return page;
                        }
                    }
                }

                $('#pag02').bootstrapPaginator(options);
            }
        })
    }


    function hookEvent2() {
        $(".tool-group").each(function (e) {
            // 赞
            //         $(this).find("a").eq(0).on("click",function () {
            //             $(this).trigger("aaa");
            //     });

            // 主回复
            $(this).find("a").eq(1).on("click",function () {
                $(this).trigger("mainReply");
            });

            // 举报
            // $(this).find("a").eq(2).on("click",function () {
            //     $(this).trigger("aaa");
            // });

        });

        $(".sub-tool-group").each(function (e) {

            // 子回复
            $(this).find("a").eq(0).on('click',function () {
                $(this).trigger("childReply");
            })

            // 子举报
            // $(this).find("a").eq(0).on('click',function () {
            //     $(this).trigger("childReply");
            // })

        })

        listeningHook($(".comment"))
    }

    function listeningHook(v) {
        var animationIn = "fadeInUp";
        var animationOut = "fadeOutDown";
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        v.bind("mainReply",function (e) {
            var html = template('comment-reply-tpl', {});
            var commentEle = $(e.currentTarget);
            var isSubCommentListHide =  commentEle.find('.sub-comment-list').hasClass("hide");
            var hasSubComment = commentEle.find('.sub-comment').length>0;
            var isReplyTplShown = commentEle.find('.new-comment').length == 1;
            var mainCommentId = takeId(commentEle.attr("id"));
            var dataId = commentEle.data("dataId");
            var userName = commentEle.find(".info a").text();
            if(dataId==undefined) {
                commentEle.data("dataId", mainCommentId);
            }
            commentEle.data("dataId", mainCommentId);
            var data = {
                userName:userName,
                html:html,
                commentEle:commentEle,
                isSubCommentListHide:isSubCommentListHide,
                hasSubComment:hasSubComment,
                isReplyTplShown:isReplyTplShown,
                dataId:dataId,
                mainCommentId:mainCommentId
            }
            isReplyTplShouldBeShown(e,data);
        })


        v.bind("childReply",function (e) {
            var html = template('comment-reply-tpl', {});
            var commentEle = $(e.currentTarget);
            var isReplyTplShown = commentEle.find('.new-comment').length == 1;
            var hasSubComment = commentEle.find('.sub-comment').length>0;
            var mainCommentId = takeId(commentEle.attr("id"));
            var childCommentId = takeId($(e.target).parents(".sub-comment").attr("id"));
            var dataId = commentEle.data("dataId");
            var mainUserName = commentEle.find(".info a").text();
            var chlidUserName = $(e.target).parents(".sub-comment").find("p>a").text();
            if(dataId==undefined) {
                commentEle.data("dataId", childCommentId);
            }
            commentEle.data("dataId", childCommentId);
            var data = {
                childCommentId:childCommentId,
                mainUserName:mainUserName,
                chlidUserName:chlidUserName,
                html:html,
                hasSubComment:hasSubComment,
                commentEle:commentEle,
                isReplyTplShown:isReplyTplShown,
                dataId:dataId,
                mainCommentId:mainCommentId
            }
            isReplyTplShouldBeShown(e, data);
        })

        function takeId(id) {
            return id.split("-")[1];
        }

        function isReplyTplShouldBeShown (e,data) {
            // css动画在这里设置
            var subCommentListEle = data.commentEle.find('.sub-comment-list');
            switch (e.type)
            {
                case "mainReply":
                    if(!data.hasSubComment){//无子评论
                        if(!data.isReplyTplShown){//无回复框
                            subCommentListEle.removeClass("hide");
                            subCommentListEle.append(data.html);
                            activeTplActions(data);
                            data.commentEle.find('.new-comment textarea').text("@"+data.userName+" ").focus();
                            subCommentListEle.addClass('animated '+animationIn).one(animationEnd, function() {
                                subCommentListEle.removeClass('animated '+animationIn);
                            });
                        }else { //有回复框
                            if(data.dataId == data.mainCommentId ){//同一按钮点击
                                subCommentListEle.addClass('animated '+animationOut).one(animationEnd, function() {
                                    subCommentListEle.removeClass('animated '+animationOut);
                                    subCommentListEle.empty();
                                    subCommentListEle.addClass('hide');
                                });

                            }else{ //不同按钮点击
                                data.commentEle.find('.new-comment textarea').text("@"+data.userName+" ").focus();
                            }

                        }
                    }else {//有子评论
                        if(!data.isReplyTplShown){//无回复框
                            subCommentListEle.append(data.html);
                            activeTplActions(data);
                            data.commentEle.find('.new-comment textarea').text("@"+data.userName+" ").focus();
                            subCommentListEle.children("div:last").addClass('animated '+animationIn).one(animationEnd, function() {
                                subCommentListEle.children("div:last").removeClass('animated '+animationIn);
                            });
                        }else { //有回复框
                            if(data.dataId == data.mainCommentId ){//同一按钮点击
                                subCommentListEle.children("div:last").addClass('animated '+animationOut).one(animationEnd, function() {
                                    subCommentListEle.children("div:last").removeClass('animated '+animationOut);
                                    subCommentListEle.children("div:last").remove();
                                });
                            }else{ //不同按钮点击
                                data.commentEle.find('.new-comment textarea').text("@"+data.userName+" ").focus();
                            }

                        }
                    }
                    break;
                case "childReply":
                    if(!data.isReplyTplShown){//无回复框
                        subCommentListEle.append(data.html);
                        activeTplActions(data);
                        data.commentEle.find('.new-comment textarea').text("@"+data.chlidUserName+" ").focus();
                        subCommentListEle.children("div:last").addClass('animated '+animationIn).one(animationEnd, function() {
                            subCommentListEle.children("div:last").removeClass('animated '+animationIn);
                        });
                    }else { //有回复框
                        if(data.dataId == data.childCommentId ){//同一按钮点击
                            subCommentListEle.children("div:last").addClass('animated '+animationOut).one(animationEnd, function() {
                                subCommentListEle.children("div:last").removeClass('animated '+animationOut);
                                subCommentListEle.children("div:last").remove();
                            });
                        }else{ //不同按钮点击
                            data.commentEle.find('.new-comment textarea').text("@"+data.chlidUserName+" ").focus();
                        }
                    }
                    break;
            }

        }

        function activeTplActions(data){
          // 输入框滚动到视觉位置
          //   var screenHeight = $(window).height() + $(window).scrollTop();
          //   var commentHeight = data.commentEle.find('.new-comment').offset().top;
          // if(commentHeight>screenHeight) {
          //       var dValue = commentHeight-screenHeight;
          //     $("html,body").animate({scrollTop:(screenHeight-200+dValue)+"px"},500);
          // }
          //   不用上面这段代码了 因为focus会自动定位回复框位置
            data.commentEle.find('.new-comment .btn').click(function(){
                $(this).trigger("replyBtn",data);
            });
            data.commentEle.find('.new-comment .cancel').click(function () {
                $(this).trigger("cancelBtn",data);
            });
        }

        v.bind("replyBtn",function (e,data) {
            var subCommentListEle = data.commentEle.find('.sub-comment-list');
            $.ajax({
                url: "http://localhost/thinkc/public/comment02.json",
                type: 'POST',
                data: {
                    name:"duan"
                },
                dataType: 'json',
                success: function (data) {
                    var html = template('comment-single-tpl', data);
                    if(subCommentListEle.find(".more-comment").length){
                        subCommentListEle.find(".sub-comment:last").before(html);
                    }else{
                        if(subCommentListEle.find(".sub-comment:last").length){
                            subCommentListEle.find(".sub-comment:last").after(html);
                        }else{
                            subCommentListEle.children('div').before(html);
                        }
                    }
                    subCommentListEle.find(".sub-tool-group:last a").click(function(){
                        $(this).trigger("childReply");
                    })
                    subCommentListEle.find(".sub-comment:not(.more-comment):last").animate({
                        borderColor:"#ce352c",
                        color:"#ce352c"
                    }, 100 ).animate({
                        borderColor:"#f0f0f0",
                        color:"#333"
                    }, 3000 );
                }
            });

        });
        v.bind("cancelBtn",function (e,data) {
            var subCommentListEle = data.commentEle.find('.sub-comment-list');
            if(!data.hasSubComment){
                subCommentListEle.addClass('animated '+animationOut).one(animationEnd, function() {
                    subCommentListEle.removeClass('animated '+animationOut);
                    subCommentListEle.empty();
                    subCommentListEle.addClass('hide');
                });
            }else{
                subCommentListEle.children("div:last").addClass('animated '+animationOut).one(animationEnd, function() {
                    subCommentListEle.children("div:last").removeClass('animated '+animationOut);
                    subCommentListEle.children("div:last").remove();
                })
            }
        });
    }


//    回复后，会返回一个json
//    {
//        "id": 16777318,
//        "compiled_content": "<a href=\"/users/6cc0ebf87956\" class=\"maleskine-author\" target=\"_blank\" data-user-slug=\"6cc0ebf87956\">@心蓝丫头</a> 感觉还可以的啊 起码有文章等辅助，对老师水平更加知根知底吧 也算是一个互相了解的通道 O(∩_∩)O~",
//        "user_id": 8039418,
//        "parent_id": 16772188,
//        "created_at": "2017-10-30T20:10:17.000+08:00",
//        "user": {
//        "id": 8039418,
//            "slug": "c1fe99e37fad",
//            "nickname": "种棵白菜过大年"
//    }
//    }


    // 文章回复
    // {
    //     "id": 16931044,
    //     "compiled_content": "以后听说越来越严咯，有机会还是搞搞公租房试试吧",
    //     "floor": 4,
    //     "note_id": 19127728,
    //     "user_id": 5275529,
    //     "created_at": "2017-11-03T16:18:51.000+08:00",
    //     "user": {
    //     "id": 5275529,
    //         "slug": "dd78fdb24823",
    //         "nickname": "游戏化",
    //         "avatar": "http://upload.jianshu.io/users/upload_avatars/5275529/e18e7b48-4cd9-4fc8-9a88-a1ea6f4afc1a.png",
    //         "is_author": false
    // },
    //     "liked": false,
    //     "likes_count": 0,
    //     "children_count": 0,
    //     "children": []
    // }
})


// 展开查看 1条评论
//     [
//     {
//         "id": 16849827,
//         "compiled_content": "<a href=\"/users/5a7bba5d3447\" class=\"maleskine-author\" target=\"_blank\" data-user-slug=\"5a7bba5d3447\">@曹好好</a> 哈哈，嗯嗯，对的，做自己喜欢的啦",
//         "created_at": "2017-11-01T15:48:08.000+08:00",
//         "user": {
//             "id": 3519058,
//             "slug": "71849bf13bea",
//             "nickname": "柚子储储"
//         }
//     }
//     ]
//展开查看 8条评论
// http://www.jianshu.com/comments/16956541/more_children?seen_comment_ids[]=16958833&seen_comment_ids[]=16958839&seen_comment_ids[]=16958994
//     [
//         {
//             "id": 16959024,
//             "compiled_content": " <a href=\"/users/11867d94064c\" class=\"maleskine-author\" target=\"_blank\" data-user-slug=\"11867d94064c\">@李思怡ddup</a> 提醒注意。",
//             "created_at": "2017-11-04T11:16:51.000+08:00",
//             "user": {
//                 "id": 7938930,
//                 "slug": "5c614962630b",
//                 "nickname": "不动心斋"
//             }
//         },
//         {
//             "id": 16960647,
//             "compiled_content": "<a href=\"/users/5c614962630b\" class=\"maleskine-author\" target=\"_blank\" data-user-slug=\"5c614962630b\">@不动心斋</a> 你这个坑我们九零后不背啊，九零后是一群怎样的存在我觉得你还是没有深刻的意识到，现在很多有价值的事情都是九零后在做在支撑的，你说九零后没有价值观，习大大都认为九零后是有创造力的一代，有希望的一代，你这觉悟还比习大大高了？",
//             "created_at": "2017-11-04T12:12:46.000+08:00",
//             "user": {
//                 "id": 8118099,
//                 "slug": "21d6bcc96645",
//                 "nickname": "冷月月"
//             }
//         },
//         {
//             "id": 16960988,
//             "compiled_content": " <a href=\"/users/21d6bcc96645\" class=\"maleskine-author\" target=\"_blank\" data-user-slug=\"21d6bcc96645\">@冷月月</a> 所以，就有了“快手”啊；郭敬明现象啊；网红啊……什么什么的了啊？",
//             "created_at": "2017-11-04T12:23:50.000+08:00",
//             "user": {
//                 "id": 7938930,
//                 "slug": "5c614962630b",
//                 "nickname": "不动心斋"
//             }
//         },
//         {
//             "id": 16961062,
//             "compiled_content": " <a href=\"/users/21d6bcc96645\" class=\"maleskine-author\" target=\"_blank\" data-user-slug=\"21d6bcc96645\">@冷月月</a> 前辈们是在鼓励我们，让我们迎难而上，不要同流合污！我也是90后。",
//             "created_at": "2017-11-04T12:26:26.000+08:00",
//             "user": {
//                 "id": 7938930,
//                 "slug": "5c614962630b",
//                 "nickname": "不动心斋"
//             }
//         },
//         {
//             "id": 16961417,
//             "compiled_content": "<a href=\"/users/5c614962630b\" class=\"maleskine-author\" target=\"_blank\" data-user-slug=\"5c614962630b\">@不动心斋</a> 不要以点概面好吗，总挑那么个案例来代表大多数九零后，做结论要有数据支撑，你要能证明百分之八十的九零后都是网红都是郭敬明你再下这种结论",
//             "created_at": "2017-11-04T12:39:16.000+08:00",
//             "user": {
//                 "id": 8118099,
//                 "slug": "21d6bcc96645",
//                 "nickname": "冷月月"
//             }
//         },
//         {
//             "id": 16961551,
//             "compiled_content": " <a href=\"/users/21d6bcc96645\" class=\"maleskine-author\" target=\"_blank\" data-user-slug=\"21d6bcc96645\">@冷月月</a> 最可恶的就是郭敬明现象！我以前真傻，单知道，影视圈里有丑恶现象，没想到，能蔓延到写作圈！真是“国将不国”，这是一件“很妈妈的事”！不痛快。",
//             "created_at": "2017-11-04T12:44:58.000+08:00",
//             "user": {
//                 "id": 7938930,
//                 "slug": "5c614962630b",
//                 "nickname": "不动心斋"
//             }
//         },
//         {
//             "id": 16961623,
//             "compiled_content": " <a href=\"/users/5c614962630b\" class=\"maleskine-author\" target=\"_blank\" data-user-slug=\"5c614962630b\">@不动心斋</a> 00后在此",
//             "created_at": "2017-11-04T12:47:47.000+08:00",
//             "user": {
//                 "id": 5384849,
//                 "slug": "016ade8e8069",
//                 "nickname": "vv栩生"
//             }
//         },
//         {
//             "id": 16961896,
//             "compiled_content": " <a href=\"/users/016ade8e8069\" class=\"maleskine-author\" target=\"_blank\" data-user-slug=\"016ade8e8069\">@vv栩生</a> 你也来找打？",
//             "created_at": "2017-11-04T12:54:51.000+08:00",
//             "user": {
//                 "id": 7938930,
//                 "slug": "5c614962630b",
//                 "nickname": "不动心斋"
//             }
//         }
//     ]