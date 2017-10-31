DROP TABLE IF EXISTS `cmf_commentd`;
CREATE TABLE IF NOT EXISTS `cmf_commentd` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `topic_id` int(10) unsigned DEFAULT NULL COMMENT '主题id',
  `topic_table_name` tinyint(2) unsigned NOT NULL DEFAULT '1' COMMENT '文章表名称',
  `content` text COMMENT '评论内容',
  `from_uid` int(10) unsigned DEFAULT NULL COMMENT '评论者id，一般为会员表的id',
  `to_id` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '被评论的用户id',
  `nickname` varchar(60) DEFAULT NULL COMMENT '冗余用户昵称',
  `thumb_img` varchar(255) DEFAULT NULL COMMENT '冗余用户头像',
  `is_top` tinyint(2) unsigned NOT NULL DEFAULT '0' COMMENT '是否置顶评论，1为置顶，0为不置顶',
  `is_hot` tinyint(2) unsigned NOT NULL DEFAULT '0' COMMENT '是否为热评，1为热评',
  `like_num` int(5) unsigned DEFAULT '0' COMMENT '评论被点赞的次数',
  `reply_num` int(5) unsigned DEFAULT '0' COMMENT '评论被回复的次数',
  `object_id` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '评论内容 id',
  `type` tinyint(3) UNSIGNED NOT NULL DEFAULT '1' COMMENT '评论类型；1实名评论',
  `status` tinyint(2) unsigned NOT NULL COMMENT '评论状态，-1为删除，0为待审核，1为已发布',
  `create_time` int(11) unsigned DEFAULT NULL COMMENT '创建时间',
  `delete_time` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '删除时间',
  `email` varchar(255) NOT NULL DEFAULT '' COMMENT '评论者邮箱',
  `url` text COMMENT '原文地址',
  PRIMARY KEY (`id`),
  KEY `topic_id` (`topic_id`) USING BTREE,
  KEY `topic_table_name` (`topic_table_name`) USING BTREE,
  KEY `from_id` (`from_uid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `cmf_commentd_reply`;
CREATE TABLE IF NOT EXISTS `cmf_commentd_reply` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `comment_id` int(10) unsigned DEFAULT NULL COMMENT '评论id',
  `reply_type` tinyint(2) unsigned DEFAULT '1' COMMENT '1为回复评论，2为回复别人的回复',
  `reply_id` int(10) unsigned DEFAULT NULL COMMENT '回复目标id，reply_type为1时，是comment_id，reply_type为2时为回复表的id',
  `content` text CHARACTER SET utf8 COMMENT '回复内容',
  `to_uid` int(10) unsigned DEFAULT NULL COMMENT '回复目标id',
  `from_uid` int(10) unsigned DEFAULT NULL COMMENT '回复用户id',
  `from_thumb_img` varchar(255) CHARACTER SET utf8 DEFAULT NULL COMMENT '回复者的头像',
  `from_nickname` varchar(50) CHARACTER SET utf8 DEFAULT NULL COMMENT '回复者的昵称',
  `create_time` int(11) unsigned DEFAULT NULL COMMENT '评论时间',
  `to_nickname` varchar(50) CHARACTER SET utf8 DEFAULT NULL COMMENT '冗余回复对象的昵称',
  `is_author` tinyint(2) unsigned DEFAULT NULL COMMENT '0为普通回复，1为后台管理员回复，',
  PRIMARY KEY (`id`),
  KEY `comment_id` (`comment_id`) USING BTREE,
  KEY `from_uid` (`from_uid`) USING BTREE,
  KEY `to_uid` (`to_uid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8
