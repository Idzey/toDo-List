import { Button, DatePicker, Form, Input } from "antd";
import useFilterStore from "../../store/filter";

const Filter = () => {
  const {filterTitle, filterDate, setFilterDate, setFilterTitle, resetFilter} = useFilterStore();
  
  const [form] = Form.useForm();

  return (
    <div className="ml-5">
      <Form layout="inline" form={form} className="flex gap-2">
        <Form.Item>
          <Input
            onChange={(e) => setFilterTitle(e.target.value)}
            value={filterTitle}
            placeholder="Filter by title"
          />
        </Form.Item>
        <Form.Item>
          <DatePicker
            onChange={(e) => setFilterDate(e)}
            value={filterDate}
            placeholder="Filter by date"
          />
        </Form.Item>
        <Form.Item>
          <Button onClick={resetFilter}>Reset</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Filter;
