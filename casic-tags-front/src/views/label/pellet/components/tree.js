export function getArr() {
  const hours = [
    { value: '1', label: '1时' },
    { value: '2', label: '2时' },
    { value: '3', label: '3时' },
    { value: '4', label: '4时' },
    { value: '5', label: '5时' },
    { value: '6', label: '6时' },
    { value: '7', label: '7时' },
    { value: '8', label: '8时' },
    { value: '9', label: '9时' },
    { value: '10', label: '10时' },
    { value: '11', label: '11时' },
    { value: '12', label: '12时' },
    { value: '13', label: '13时' },
    { value: '14', label: '14时' },
    { value: '15', label: '15时' },
    { value: '16', label: '16时' },
    { value: '17', label: '17时' },
    { value: '18', label: '18时' },
    { value: '19', label: '19时' },
    { value: '20', label: '20时' },
    { value: '21', label: '21时' },
    { value: '22', label: '22时' },
    { value: '23', label: '23时' },
    { value: '24', label: '24时' }
  ]

  const days = [
    { value: '1', label: '1日', children: hours },
    { value: '2', label: '2日', children: hours },
    { value: '3', label: '3日', children: hours },
    { value: '4', label: '4日', children: hours },
    { value: '5', label: '5日', children: hours },
    { value: '6', label: '6日', children: hours },
    { value: '7', label: '7日', children: hours },
    { value: '8', label: '8日', children: hours },
    { value: '9', label: '9日', children: hours },
    { value: '10', label: '10日', children: hours },

    { value: '11', label: '11日', children: hours },
    { value: '12', label: '12日', children: hours },
    { value: '13', label: '13日', children: hours },
    { value: '14', label: '14日', children: hours },
    { value: '15', label: '15日', children: hours },
    { value: '16', label: '16日', children: hours },
    { value: '17', label: '17日', children: hours },
    { value: '18', label: '18日', children: hours },
    { value: '19', label: '19日', children: hours },
    { value: '20', label: '20日', children: hours },

    { value: '21', label: '21日', children: hours },
    { value: '22', label: '22日', children: hours },
    { value: '23', label: '23日', children: hours },
    { value: '24', label: '24日', children: hours },
    { value: '25', label: '25日', children: hours },
    { value: '26', label: '26日', children: hours },
    { value: '27', label: '27日', children: hours },
    { value: '28', label: '28日', children: hours },
    { value: '29', label: '29日', children: hours }
  ]
  const quarters = [
    {
      value: '1',
      label: '第一月',
      children: days.concat([
        { value: '30', label: '30日', children: hours },
        { value: '31', label: '31日', children: hours }
      ])
    },
    {
      value: '2',
      label: '第二月',
      children: days.concat([
        { value: '30', label: '30日', children: hours },
        { value: '31', label: '31日', children: hours }
      ])
    },
    {
      value: '3',
      label: '第三月',
      children: days.concat([
        { value: '30', label: '30日', children: hours },
        { value: '31', label: '31日', children: hours }
      ])
    }
  ]
  const weeks = [
    { value: '1', label: '星期一', children: hours },
    { value: '2', label: '星期二', children: hours },
    { value: '3', label: '星期三', children: hours },
    { value: '4', label: '星期四', children: hours },
    { value: '5', label: '星期五', children: hours },
    { value: '6', label: '星期六', children: hours },
    { value: '0', label: '星期日', children: hours }
  ]

  const months = [
    {
      value: '1',
      label: '一月',
      children: days.concat([
        { value: '30', label: '30日', children: hours },
        { value: '31', label: '31日', children: hours }
      ])
    },
    { value: '2', label: '二月', children: days },
    {
      value: '3',
      label: '三月',
      children: days.concat([
        { value: '30', label: '30日', children: hours },
        { value: '31', label: '31日', children: hours }
      ])
    },
    { value: '4', label: '四月', children: days.concat([{ value: '30', label: '30日', children: hours }]) },
    {
      value: '5',
      label: '五月',
      children: days.concat([
        { value: '30', label: '30日', children: hours },
        { value: '31', label: '31日', children: hours }
      ])
    },
    { value: '6', label: '六月', children: days.concat([{ value: '30', label: '30日', children: hours }]) },
    {
      value: '7',
      label: '七月',
      children: days.concat([
        { value: '30', label: '30日', children: hours },
        { value: '31', label: '31日', children: hours }
      ])
    },
    {
      value: '8',
      label: '八月',
      children: days.concat([
        { value: '30', label: '30日', children: hours },
        { value: '31', label: '31日', children: hours }
      ])
    },
    { value: '9', label: '九月', children: days.concat([{ value: '30', label: '30日', children: hours }]) },
    {
      value: '10',
      label: '十月',
      children: days.concat([
        { value: '30', label: '30日', children: hours },
        { value: '31', label: '31日', children: hours }
      ])
    },
    { value: '11', label: '十一月', children: days.concat([{ value: '30', label: '30日', children: hours }]) },
    {
      value: '12',
      label: '十二月',
      children: days.concat([
        { value: '30', label: '30日', children: hours },
        { value: '31', label: '31日', children: hours }
      ])
    }
  ]

  return [
    {
      value: 'day',
      label: '按天',
      children: days.concat([
        { value: '30', label: '30日', children: hours },
        { value: '31', label: '31日', children: hours }
      ])
    },
    { value: 'week', label: '按周', children: weeks },
    { value: 'month', label: '按月', children: days.concat([
      { value: '30', label: '30日', children: hours },
      { value: '31', label: '31日', children: hours }
    ]) },
    { value: 'quarter', label: '按季度', children: quarters },
    { value: 'year', label: '按年', children: months }
  ]
}
