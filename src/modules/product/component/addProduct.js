import React from 'react';
import { Form, Row, Col, Icon, Input, InputNumber, Dropdown, Menu, Avatar, Select, Divider, Button, Upload, notification, Spin } from 'antd';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../product.less';

const FormItem = Form.Item;
const Option = Select.Option;

const getBrandGroupUrl = restUrl.ADDR + 'Product/getBrandList';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};

class AddProduct extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    	price: 100,
    	selectStructuralSectionOptions: [],
    	selectHardwareOptions: [],
    	selectSealantOptions: [],
    	structuralSection: '',
    	hardware: '',
    	sealant: '',
    	loading: false,
    	loading_1: true,
    	loading_2: true,
    };
  }

  componentDidMount = () => {
  	this.getBrandGroup(1);
  	this.getBrandGroup(2);
  	this.getBrandGroup(3);
  }

  //获取型材、五金、密封胶品牌，type选择
  getBrandGroup = (type) => {
  	let param = {};
  	param.type = type;
  	ajax.getJSON(getBrandGroupUrl, param, (data) => {
  		data =  eval('(' + data.backData + ')');
  		if(type === 1){
  			this.setState({
  				selectStructuralSectionOptions: data,
  				loading_1: false
  			});
  		} else if(type === 2) {
  			this.setState({
  				selectHardwareOptions: data,
  				loading_2: false
  			});
  		} else {
  			this.setState({
  				selectSealantOptions: data,
  				loading_3: false
  			});
  		}
  	});
  }

  //填充select下拉选项
  fillOptions = (list) => {
  	list = list || [];

  	return list.map(function(item, index){
  			return <Option key={index} value={item.name}>{item.name}</Option>
  		})
  }

  handleSelectChange = (value, option, type) => {
  	console.log('value === ', value);
  	console.log('option === ', option);
  	console.log('type === ', typeof type);
  	if(type === 1){
  		this.setState({
			structuralSection: value
		});
  	} else if(type === 2){
		this.setState({
			hardware: value
		});
  	} else {
  		this.setState({
			sealant: value
		});
  	}
  }

  customRequest = (data, obj, fallback) => {
  	var file = data.file;
    console.log('file === ', file);
    if (1 > 0) {
        // loadingIn();
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            var img = new Image();
            img.src = this.result;
            var fileContent = this.result;

            img.onload = function () {
                // if (fileContent.length > maxSize)
                //     fileContent = compress(this);    //图片压缩

                fileContent = fileContent.substring(fileContent.indexOf(",") + 1);

                var params = {
                    fileName: file.name,
                    fileContent: fileContent,
                    fileSize: fileContent.length
                };

                ajax.postJSON(restUrl.UPLOAD, params, function (data) {
                    if (data.success) {
                        var backData = data.backData;
                        console.log("imgbackData===", backData);
                        notification.open({
						    message: '上传成功！',
						    description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
						    icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
						});
                        if (fallback && typeof fallback == 'function')
                            fallback(img.src, backData);
                    } else {
                        alert(data.backMsg ? data.backMsg : "上传失败！");
                    }                
                })
            }
        }
    }
  }

  saveProduct = ()=> {
  	this.setState({
  		loading: true
  	});
  }

  render() {
  	let { price, selectStructuralSectionOptions, selectHardwareOptions, selectSealantOptions, structuralSection, hardware, sealant, loading_1, loading_2, loading_3 } = this.state;
  	if(structuralSection === ''){
  		structuralSection = selectStructuralSectionOptions.length > 0 ? selectStructuralSectionOptions[0].name : '';
  	}
  	if(hardware === ''){
  		hardware = selectHardwareOptions.length > 0 ? selectHardwareOptions[0].name : '';
  	}
  	if(sealant === ''){
		sealant = selectSealantOptions.length > 0 ? selectSealantOptions[0].name : '';
	}
    return (
      <div className="zui-cotent">
      	<div className="ibox-title">
            <h5>新增产品</h5>
        </div>
        <div className="ibox-content">
	      	<Form>
	      		<Divider>基本信息</Divider>
	      		<Row>
	      			<Col span={12}>
	      				<FormItem
				            label="封面上传"
				            {...formItemLayout}
				          >
				            <Upload
				            	action={restUrl.UPLOAD}
							    listType={'picture'}
							    multiple={true}
							    className='upload-list-inline'
							    customRequest={(data) => {
							    	this.customRequest(data);
							    }}
				            >
						      <Button><Icon type="upload" /> 上传</Button>
						    </Upload>
				        </FormItem>	      	
	      			</Col>
	      		</Row>
	      		<Row>
	      			<Col span={12}>
				        <FormItem
				            label="产品名称"
				            {...formItemLayout}
				          >
				            <Input placeholder="" />
				        </FormItem>
				    </Col>
				    <Col span={12}>
				        <FormItem
				            label="产品类别"
				            {...formItemLayout}
				          >
				            <Input placeholder="" />
				        </FormItem>
				    </Col>
			    </Row>
			    <Row>
	      			<Col span={12}>
				        <FormItem
				            label="单价"
				            {...formItemLayout}
				          >
				            <InputNumber 
				            	value={price}
				            	precision={2}
				            	formatter={(value) => value + ' 元'}
				            	style={{width: '100%'}}
				            />
				        </FormItem>
				    </Col>
				    <Col span={12}>
				        <FormItem
				            label="产品规格"
				            {...formItemLayout}
				          >
				            <Input placeholder="" />
				        </FormItem>
				    </Col>
			    </Row>
			    <Row>
	      			<Col span={12}>	    
				        <FormItem
				            label="型材品牌"
				            {...formItemLayout}
				         >
				          	<Spin spinning={loading_1} indicator={<Icon type="loading" />}>
					            <Select
					              placeholder="-请选择-"
					              value={structuralSection}
					              onChange={ (value, option) => {
					              		this.handleSelectChange(value, option, 1);
					              	}
					              }
					            >
					              {this.fillOptions(selectStructuralSectionOptions)}
					            </Select>
				            </Spin>
				        </FormItem>
				    </Col>
				    <Col span={12}>
				        <FormItem
				            label="五金配件"
				            {...formItemLayout}
				         >
				         	<Spin spinning={loading_2} indicator={<Icon type="loading" />}>
					            <Select
					              placeholder="-请选择-"
					              value={hardware}
					              onChange={ (value, option) => {
					              		this.handleSelectChange(value, option, 2);
					              	}
					              }
					            >
					              {this.fillOptions(selectHardwareOptions)}
					            </Select>
					        </Spin>
				        </FormItem>
				    </Col>
			    </Row>
			    <Row>
	      			<Col span={12}>
				        <FormItem
				            label="密封胶品牌"
				            {...formItemLayout}
				        >
				          	<Spin spinning={loading_3} indicator={<Icon type="loading" />}>
					            <Select
					              placeholder="-请选择-"
					              value={sealant}
					              onChange={ (value, option) => {
					              		this.handleSelectChange(value, option, 3);
					              	}
					              }
					            >
					              {this.fillOptions(selectSealantOptions)}
					            </Select>
					        </Spin>
				        </FormItem>
				    </Col>
				    <Col span={12}>
				        <FormItem
				            label="说明"
				            {...formItemLayout}
				          >
				            <Input.TextArea autosize={{minRows: 4, maxRows: 6}} />
				        </FormItem>
				    </Col>
			    </Row>
			    <Divider></Divider>
			    <Row type="flex" justify="center">
			    	<Col>
			    		<Button type="primary" loading={this.state.loading} onClick={this.saveProduct}>
				          提交
				        </Button>
			    	</Col>
			    </Row>
	        </Form>
	    </div>
      </div>
    );
  }
}

export default AddProduct;
