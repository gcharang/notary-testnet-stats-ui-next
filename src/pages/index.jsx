import useSWR, { SWRConfig } from "swr";
import axios from "axios";
import moment from "moment"
import { useState, useEffect } from 'react'
import { Tab } from '@headlessui/react'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Column,
  Table,
  ColumnFiltersState,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  sortingFns,
  getSortedRowModel,
  FilterFn,
  SortingFn,
  ColumnDef,
  FilterFns,
} from '@tanstack/react-table'
import {
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils"

const dataUrl =
  "https://kmd-data.s3.us-east-2.amazonaws.com/notary-stats-2023/main.json";
async function getDataFromAPI(url) {
  let data = await fetch(url).then((r) => r.json());
  return data;
}

export async function getStaticProps() {
  // `getStaticProps` is executed on the server side.
  const notaryStats = await getDataFromAPI(dataUrl);

  return {
    props: {
      fallback: {
        [dataUrl]: notaryStats,
      },
    },
  };
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function humanizeTime(timeStamp) {
  let momentNow = moment()
  let parsedTimeStamp = moment.unix(timeStamp
  );
  return Math.abs(
    moment.duration(parsedTimeStamp.diff(momentNow)).asMinutes()
  ) < 45
    ? moment.duration(parsedTimeStamp.diff(momentNow)).humanize(true)
    : moment
      .duration(parsedTimeStamp.diff(momentNow))
      .humanize(true) +
    ` (${Math.round(
      Math.abs(
        moment.duration(parsedTimeStamp.diff(momentNow)).asMinutes()
      )
    )} minutes)`;
}

export default function Home({ fallback }) {
  const [mounted, setMounted] = useState(false)
  const [categories, setCategories] = useState({})
  useEffect(() => {
    setMounted(true)
  }, [])
  const fetcher = async (url) =>
    await axios
      .get(url)
      .then((res) => {
        // console.log(res.data);
        return res.data;
      })
      .catch((err) => console.log(err.response.data.error));
  const { data } = useSWR(mounted ? dataUrl : null, fetcher, {
    fallbackData: fallback[dataUrl],
    refreshInterval: 3000,
  });

  useEffect(() => {
    if (data) {
      let tableData = {}
      tableData.day = data.map((notary) => {
        let data = {}
        data.name = notary.name
        data.total =
          notary.DOC.pastCounts.last24 +
          notary.MARTY.pastCounts.last24
        data["Doc.total"] = notary.DOC.pastCounts.last24;
        data["Doc.lastNota"] = `<a href=https://doc.dragonhound.info/tx/${notary.DOC.lastNotaTxnId}>${humanizeTime(notary.DOC.lastNotaTimeStamp)}</a>`
        data["Marty.total"] = notary.MARTY.pastCounts.last24;
        data["Marty.lastNota"] = `<a href=https://marty.dragonhound.info/tx/${notary.MARTY.lastNotaTxnId}>${humanizeTime(notary.MARTY.lastNotaTimeStamp)}</a>`
        return data;
      })
      tableData["3days"] = data.map((notary) => {
        let data = {}
        data.name = notary.name
        data.total =
          notary.DOC.pastCounts.last72 +
          notary.MARTY.pastCounts.last72 
        data["Doc.total"] = notary.DOC.pastCounts.last72;
        data["Doc.lastNota"] = `<a href=https://doc.dragonhound.info/tx/${notary.DOC.lastNotaTxnId}>${humanizeTime(notary.DOC.lastNotaTimeStamp)}</a>`
        data["Marty.total"] = notary.MARTY.pastCounts.last72;
        data["Marty.lastNota"] = `<a href=https://marty.dragonhound.info/tx/${notary.MARTY.lastNotaTxnId}>${humanizeTime(notary.MARTY.lastNotaTimeStamp)}</a>`
        return data;
      });
      tableData.week = data.map((notary) => {
        let data = {}
        data.name = notary.name
        data.total =
          notary.DOC.pastCounts.last168 +
          notary.MARTY.pastCounts.last168 
        data["Doc.total"] = notary.DOC.pastCounts.last168;
        data["Doc.lastNota"] = `<a href=https://doc.dragonhound.info/tx/${notary.DOC.lastNotaTxnId}>${humanizeTime(notary.DOC.lastNotaTimeStamp)}</a>`
        data["Marty.total"] = notary.MARTY.pastCounts.last168;
        data["Marty.lastNota"] = `<a href=https://marty.dragonhound.info/tx/${notary.MARTY.lastNotaTxnId}>${humanizeTime(notary.MARTY.lastNotaTimeStamp)}</a>`
        return data;
      });

      tableData.total = data.map((notary) => {
          let data = {}
          data.name = notary.name
          data.total =
            notary.DOC.totalNotas +
            notary.MARTY.totalNotas 
          data["Doc.total"] = notary.DOC.totalNotas;
          data["Doc.lastNota"] = `<a href=https://doc.dragonhound.info/tx/${notary.DOC.lastNotaTxnId}>${humanizeTime(notary.DOC.lastNotaTimeStamp)}</a>`
          data["Marty.total"] = notary.MARTY.totalNotas;
          data["Marty.lastNota"] = `<a href=https://marty.dragonhound.info/tx/${notary.MARTY.lastNotaTxnId}>${humanizeTime(notary.MARTY.lastNotaTimeStamp)}</a>`
          return data;
      });
      setCategories(tableData)
      console.log(tableData)
    }
  }, [data]);

  // {
  //   day: [
  //     {
  //       id: 1,
  //       name:,
  //         total:,
  //       "Doc.total":,
  //       "Doc.lastNota": ,
  //       date: '5h ago',
  //       commentCount: 5,
  //       shareCount: 2,
  //     },
  //     {
  //       id: 2,
  //       title: "So you've bought coffee... now what?",
  //       date: '2h ago',
  //       commentCount: 3,
  //       shareCount: 2,
  //     },
  //   ],
  //   "3days": [
  //     {
  //       id: 1,
  //       title: 'Is tech making coffee better or worse?',
  //       date: 'Jan 7',
  //       commentCount: 29,
  //       shareCount: 16,
  //     },
  //     {
  //       id: 2,
  //       title: 'The most innovative things happening in coffee',
  //       date: 'Mar 19',
  //       commentCount: 24,
  //       shareCount: 12,
  //     },
  //   ],
  //   week: [
  //     {
  //       id: 1,
  //       title: 'Ask Me Anything: 10 answers to your questions about coffee',
  //       date: '2d ago',
  //       commentCount: 9,
  //       shareCount: 5,
  //     },
  //     {
  //       id: 2,
  //       title: "The worst advice we've ever heard about coffee",
  //       date: '4d ago',
  //       commentCount: 1,
  //       shareCount: 2,
  //     },
  //   ],
  //   total: [
  //     {
  //       id: 1,
  //       title: 'Ask Me Anything: 10 answers to your questions about coffee',
  //       date: '2d ago',
  //       commentCount: 9,
  //       shareCount: 5,
  //     },
  //     {
  //       id: 2,
  //       title: "The worst advice we've ever heard about coffee",
  //       date: '4d ago',
  //       commentCount: 1,
  //       shareCount: 2,
  //     },
  //   ],
  // }

  const columnHelper = createColumnHelper()
  const columns = [
    columnHelper.accessor('name', {
      cell: props => <span>{props.getValue()} ({props.row.original.address})</span>,
      header: () => <span>Name</span>,
    }),
    columnHelper.accessor('total', {
      cell: info => info.getValue(),
      header: () => <span>Total</span>,
    }),
    columnHelper.accessor('doctotal', {
      cell: info => info.getValue(),
      header: () => <span>Doc.total</span>,
    }),
    columnHelper.accessor('doctime', {
      cell: props => <a href={props.row.original.doclink}>{humanizeTime(props.getValue())}</a>,
      header: () => <span>Doc.lastNota</span>,
    }),
    columnHelper.accessor('martytotal', {
      cell: info => info.getValue(),
      header: () => <span>Marty.total</span>,
    }),
    columnHelper.accessor('martytime', {
      cell: props => <a href={props.row.original.martylink}>{humanizeTime(props.getValue())}</a>,
      header: () => <span>Marty.lastNota</span>,
    }),
  ]

  //  const table = useReactTable(categories.day, columns)



  return (
    <>
      <SWRConfig value={{ fallback }}>
        <div className="w-full px-2 py-16 sm:px-0">
          <Tab.Group>
            <Tab.List className="flex p-1 space-x-1 rounded-xl bg-blue-900/20">
              {Object.keys(categories).map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-grey-700',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-blue-500 shadow'
                        : 'text-grey-100 hover:bg-white/[0.12] hover:text-blue-200'
                    )
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
              {Object.values(categories).map((notaryData, idx) => (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    'rounded-xl bg-br-lighter-black p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                  )}
                >
                  <table className="relative w-full table-fixed bg-br-lighter-black rounded-[25px] mt-[17px] px-8 z-10">
                    <thead className="border-b-2" style={{ borderColor: "#252B51" }} >
                      <tr>
                        {Object.keys(notaryData[0]).map((key) => (
                          <th key={key}>
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="pt-4">
                      {notaryData.map((notary) => (
                        <tr key={notary.address} className="h-[67px] hover:bg-br-darker-black">
                          {Object.keys(notary).map((key) => (
                            <td key={key} className={"text-center"}>
                              {notary[key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                    {/* <tfoot>
                      {table.getFooterGroups().map((footerGroup) => (
                        <tr key={footerGroup.id}>
                          {footerGroup.headers.map((header) => (
                            <th key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                  header.column.columnDef.footer,
                                  header.getContext()
                                )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </tfoot> */}
                  </table>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </SWRConfig>
    </>
  )
}
