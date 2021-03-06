import React from 'react';
import {Link} from 'react-router';
import {Table, Icon, Divider, Breadcrumb, Menu, Dropdown, Popconfirm, Spin} from 'antd';
import restUrl from 'RestUrl';
import '../product.less';
import {notification} from "antd/lib/index";
import ajax from "Utils/ajax";

const getProductListUrl = restUrl.ADDR + 'Product/getProductList';
const delProductUrl = restUrl.ADDR + 'Product/delProduct';

class ProductList extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [{
            title: '产品名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => (
                <Link to={this.detailrouter(record.id)}>{text}</Link>
            )
        }, {
            title: '类别',
            dataIndex: 'type',
            key: 'type',
        }, {
            title: '品牌',
            children: [{
                title: '型材品牌',
                dataIndex: 'structuralSection',
                key: 'structuralSection',
            }, {
                title: '五金配件',
                dataIndex: 'hardware',
                key: 'hardware',
            }, {
                title: '密封胶品牌',
                dataIndex: 'sealant',
                key: 'sealant',
            }]
        }, {
            title: '单价',
            dataIndex: 'price',
            key: 'price',
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text, record, index) => {
              if(text === '0'){
                  return '上架';
              }else {
                  return '下架';
              }
            }
        }, {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
        }, {
            title: <a><Icon type="setting" style={{fontSize: 18}}/></a>,
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record, index) => (
                <Dropdown
                    overlay={<Menu>
                        <Menu.Item>
                            <Link to={this.detailrouter(record.id)}>详情</Link>
                        </Menu.Item>
                        <Menu.Item>
                            <a onClick={() => this.onDelete(record.id)}>删除</a>
                        </Menu.Item>
                    </Menu>}
                >
                    <a className="ant-dropdown-link">操作</a>
                </Dropdown>
            ),
        }];

        this.state = {
            dataSource: [],
            visible: false,
            loading: true,
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        const {getProductList} = this.props;
        getProductList(getProductListUrl);
    }

    detailrouter = (id) => {
        return `/frame/product/editProduct/${id}`
    }

    onDelete = id => {
        let param = {};
        param.id = id;
        this.setState({
            loading: true
        });
        ajax.postJSON(delProductUrl, JSON.stringify(param), (data) => {
            if (data.success) {
                notification.open({
                    message: '删除产品成功！',
                    icon: <Icon type="smile-circle" style={{color: '#108ee9'}}/>,
                });

                const dataSource = [...this.state.dataSource];
                this.setState({
                    dataSource: dataSource.filter(item => item.id !== id),
                    loading: false
                });
            }
        });
    }

    render() {
        console.log('product this.props === ', this.props);
        const {dataSource, loading} = this.props;

        return (
            <div className="zui-content">
                <div className="breadcrumb-block">
                    <Breadcrumb>
                        <Breadcrumb.Item>首页</Breadcrumb.Item>
                        <Breadcrumb.Item>产品管理</Breadcrumb.Item>
                        <Breadcrumb.Item>产品列表</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="ibox-title">
                    <h5>所有产品</h5>
                </div>
                <div className="ibox-content">
                    <Spin spinning={loading}>
                        <Table
                            bordered={true}
                            dataSource={dataSource}
                            columns={this.columns}
                        />
                    </Spin>
                </div>

            </div>
        );
    }
}

ProductList.contextTypes = {
    router: React.PropTypes.object
}

export default ProductList;