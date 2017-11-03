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
            if(dataId==undefined) {
                commentEle.data("dataId", mainCommentId);
            }
            var data = {
                isSubCommentListHide:isSubCommentListHide,
                hasSubComment:hasSubComment,
                isReplyTplShown:isReplyTplShown,
                dataId:dataId,
                mainCommentId:mainCommentId
            }
            var state = isReplyTplShouldBeShown(e,data);
            if(state==1){
                commentEle.find('.sub-comment-list').removeClass('hide').append(html);
            }
        })


        $('.comment').bind("childReply",function (e) {
            isReplyTplShouldBeShown(e, data);
        })

        function takeId(id) {
            return id.split("-")[1];
        }

        function isReplyTplShouldBeShown (e,data) {
            switch (e.type)
            {
                case "mainReply":
                    // if(data.isSubCommentListHide){
                    //     return 1;
                    // }
                    if(data.isReplyTplShown) {
                        return false;
                    }
                    return 1;
                case "childReply":
                    x="Today it's Sunday";
                    break;
            }

        }

    }




    
    function hookEvent() {
        // $(".tool-group").each(function (i) {
        //     $(this).find("a").eq(1).toggle(function () {
        //         var newC = $(this).parents('.comment').find('.new-comment');
        //         // 查看子回复框是否已经加载过 如果加载过 show出来 没加载过 加载之
        //         if($(newC).length) {
        //             newC.show();
        //         }else {
        //             var html = template('comment-reply-tpl', {});
        //             $(this).parents('.comment').find('.more-comment').after(html);
        //         }
        //     },function () {
        //         // 隐藏子回复框
        //         $(this).parents('.comment').find('.new-comment').hide();
        //     })
        //
        //
        //     // $(this).find("a").eq(1).on('click',function () {
        //     //     console.log(2222);
        //     //
        //     // });
        // })
        // $(".tool-group a").first().on('click', function () {
        //     console.log(123);
        // });
        // $(".tool-group a").last().on('click', function () {
        //     console.log(456);
        // });
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