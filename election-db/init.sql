CREATE TABLE admins (
    admin_id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
    account VARCHAR(64) NOT NULL COMMENT '账号',
    pass CHAR(64) NOT NULL COMMENT '密码',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    salt CHAR(10) NOT NULL,
    PRIMARY KEY (`admin_id`),
    UNIQUE INDEX (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '管理员账号表';

/* 初始账号 */
insert into `admins` (`admin_id`, `account`, `pass`, `salt`) values('1','admin','9f9501e5389fafea17dded15df6c079b158272f497109ae5a38236ed3d609ec6','MB55W68VIY');

CREATE TABLE candidates (
    candidate_id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '候选人ID',
    election_id INT UNSIGNED NOT NULL COMMENT '选举ID',
    `name` VARCHAR(16) COMMENT '候选人姓名',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`candidate_id`),
    KEY(`election_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '候选人表';

CREATE TABLE elections (
    election_id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '选举ID',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    stat TINYINT UNSIGNED NOT NULL COMMENT '选举状态 1.已创建 2.开始选举 3.选举结束',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`election_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '选举表';

CREATE TABLE votes (
    vote_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '选票ID',
    elector_id CHAR(10) NOT NULL COMMENT '选民香港身份证号',
    elector_email VARCHAR(64) NOT NULL COMMENT '选民电子邮箱',
    candidate_id INT UNSIGNED NOT NULL COMMENT '候选人ID',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`vote_id`),
    INDEX (`elector_id`),
    INDEX (`candidate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '选票表';