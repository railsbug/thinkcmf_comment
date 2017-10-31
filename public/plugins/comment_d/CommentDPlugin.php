<?php

namespace plugins\comment_d;
use cmf\lib\Plugin;
use think\Db;

//Demo插件英文名，改成你的插件英文就行了
class CommentDPlugin extends Plugin
{

    public $info = [
        'name'        => 'CommentD',
        'title'       => 'd之評論',
        'description' => 'd之評論',
        'status'      => 1,
        'author'      => 'd',
        'version'     => '1.0',
        'demo_url'    => '',
        'author_url'  => ''
    ];

    public $hasAdmin = 0;//插件是否有后台管理界面

    // 插件安装
    public function install()
    {
        $dbConfig = Config('database');
        $dbSql = cmf_split_sql(PLUGINS_PATH . 'comment_d/data/comment_d.sql', $dbConfig['prefix'], $dbConfig['charset']);

        if (empty($dbConfig) || empty($dbSql)) {
            $this->error("非法安装");
        }
        $db = Db::connect($dbConfig);

        foreach ($dbSql as $key => $sql) {
            $db->execute($sql);
        }

        return true;//安装成功返回true，失败false
    }

    // 插件卸载
    public function uninstall()
    {
        $dbConfig = Config('database');
        $sql = "DROP TABLE IF EXISTS " . $dbConfig['prefix'] . "commentd";
        $sql2 = "DROP TABLE IF EXISTS " . $dbConfig['prefix'] . "commentd_reply";

        if (empty($dbConfig) || empty($sql)) {
            $this->error("非法安装");
        }

        $db = Db::connect($dbConfig);

        try {
            $db->execute($sql);
            $db->execute($sql2);
        } catch (\Exception $e) {
            return false;
        }

        return true;//卸载成功返回true，失败false
    }


    //实现的footer_start钩子方法
    public function commentD($param)
    {

        $config = $this->getConfig();
        $this->assign($config);
        echo $this->fetch('css');
        echo $this->fetch('js');
        echo $this->fetch('widget');
    }

}