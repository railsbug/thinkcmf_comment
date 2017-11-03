$(function(){

//        主评论框点击焦点下拉出提交按钮
    var writeFunctionBlockTpl = $('#write-function-block-tpl').html();
    $(".new-comment:first textarea").one('focus',function () {
        $(".new-comment:first").append(writeFunctionBlockTpl);
        $(".new-comment:first .write-function-block").slideDown();
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

        var html = template('comment-reply-tpl', {});


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

        $('.comment').bind("mainReply",function (e) {
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


        $('.comment').bind("childReply",function (e) {
            var html = template('comment-reply-tpl', {});
            var commentEle = $(e.currentTarget);
            var isReplyTplShown = commentEle.find('.new-comment').length == 1;
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
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            // css动画在这里设置
            var animationIn = "fadeInUp";
            var animationOut = "fadeOutDown";
            var subCommentListEle = data.commentEle.find('.sub-comment-list');
            switch (e.type)
            {
                case "mainReply":
                    if(!data.hasSubComment){//无子评论
                        if(!data.isReplyTplShown){//无回复框
                            subCommentListEle.removeClass("hide");
                            subCommentListEle.append(data.html);
                            data.commentEle.find('.new-comment textarea').text("@"+data.userName);
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
                                data.commentEle.find('.new-comment textarea').text("@"+data.userName);
                            }

                        }
                    }else {//有子评论
                        if(!data.isReplyTplShown){//无回复框
                            subCommentListEle.append(data.html);
                            data.commentEle.find('.new-comment textarea').text("@"+data.userName);
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
                                data.commentEle.find('.new-comment textarea').text("@"+data.userName);
                            }

                        }
                    }
                    break;
                case "childReply":
                    if(!data.isReplyTplShown){//无回复框
                        subCommentListEle.append(data.html);
                        data.commentEle.find('.new-comment textarea').text("@"+data.chlidUserName);
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
                            data.commentEle.find('.new-comment textarea').text("@"+data.chlidUserName);
                        }
                    }
                    break;
            }

        }

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

})