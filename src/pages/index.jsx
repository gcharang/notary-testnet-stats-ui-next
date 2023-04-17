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
  let parsedTimeStamp = moment(timeStamp);
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
        data.name = `${notary.name} (${notary.address})`
        data.total =
          notary.DOC.pastCounts.last24 +
          notary.MARTY.pastCounts.last24
        data["Doc.total"] = notary.DOC.pastCounts.last24;
        data["Doc.lastNota"] = { href: `https://doc.dragonhound.info/tx/${notary.DOC.lastNotaTxnId}`, time: humanizeTime(notary.DOC.lastNotaTimeStamp) }
        data["Marty.total"] = notary.MARTY.pastCounts.last24;
        data["Marty.lastNota"] = { href: `https://marty.dragonhound.info/tx/${notary.DOC.lastNotaTxnId}`, time: humanizeTime(notary.MARTY.lastNotaTimeStamp) }
        return data;
      }).sort((notary1,notary2)=> notary2.total - notary1.total)
      tableData["3days"] = data.map((notary) => {
        let data = {}
        data.name = `${notary.name} (${notary.address})`
        data.total =
          notary.DOC.pastCounts.last72 +
          notary.MARTY.pastCounts.last72
        data["Doc.total"] = notary.DOC.pastCounts.last72;
        data["Doc.lastNota"] = { href: `https://doc.dragonhound.info/tx/${notary.DOC.lastNotaTxnId}`, time: humanizeTime(notary.DOC.lastNotaTimeStamp) }
        data["Marty.total"] = notary.MARTY.pastCounts.last72;
        data["Marty.lastNota"] = { href: `https://marty.dragonhound.info/tx/${notary.DOC.lastNotaTxnId}`, time: humanizeTime(notary.MARTY.lastNotaTimeStamp) }
        return data;
      }).sort((notary1,notary2)=> notary2.total - notary1.total);
      tableData.week = data.map((notary) => {
        let data = {}
        data.name = `${notary.name} (${notary.address})`
        data.total =
          notary.DOC.pastCounts.last168 +
          notary.MARTY.pastCounts.last168
        data["Doc.total"] = notary.DOC.pastCounts.last168;
        data["Doc.lastNota"] = { href: `https://doc.dragonhound.info/tx/${notary.DOC.lastNotaTxnId}`, time: humanizeTime(notary.DOC.lastNotaTimeStamp) }
        data["Marty.total"] = notary.MARTY.pastCounts.last168;
        data["Marty.lastNota"] = { href: `https://marty.dragonhound.info/tx/${notary.DOC.lastNotaTxnId}`, time: humanizeTime(notary.MARTY.lastNotaTimeStamp) }
        return data;
      }).sort((notary1,notary2)=> notary2.total - notary1.total);

      tableData.total = data.map((notary) => {
        let data = {}
        data.name = `${notary.name} (${notary.address})`
        data.total =
          notary.DOC.totalNotas +
          notary.MARTY.totalNotas
        data["Doc.total"] = notary.DOC.totalNotas;
        data["Doc.lastNota"] = { href: `https://doc.dragonhound.info/tx/${notary.DOC.lastNotaTxnId}`, time: humanizeTime(notary.DOC.lastNotaTimeStamp) }
        data["Marty.total"] = notary.MARTY.totalNotas;
        data["Marty.lastNota"] = { href: `https://marty.dragonhound.info/tx/${notary.DOC.lastNotaTxnId}`, time: humanizeTime(notary.MARTY.lastNotaTimeStamp) }
        return data;
      }).sort((notary1,notary2)=> notary2.total - notary1.total);
      setCategories(tableData)
    }
  }, [data]);


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
                    'rounded-xl bg-br-lighter-black p-3 overflow-x-auto',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                  )}
                >
                  <table className="relative w-full table-fixed bg-br-lighter-black rounded-[25px] mt-[17px] px-8 z-10 min-w-[680px]">
                    <thead className="border-b-2" style={{ borderColor: "#252B51" }} >
                      <tr>
                        {/* {Object.keys(notaryData[0]).map((key) => (
                          <th key={key}>
                            {key}
                          </th>
                        ))} */}
                        <th key="name">
                          Name
                        </th>
                        <th key="total">
                          Total
                        </th>
                        <th key="Doc.total">
                          Doc.total
                        </th>
                        <th key="Doc.lastNota">
                          Doc.lastNota
                        </th>
                        <th key="Marty.total">
                          Marty.total
                        </th>
                        <th key="Marty.lastNota">
                          Marty.lastNota
                        </th>
                      </tr>
                    </thead>
                    <tbody className="pt-4">
                      {notaryData.map((notary) => (
                        <tr key={notary.address} className="h-[67px] hover:bg-br-darker-black">
                          {/* {Object.keys(notary).map((key) => (
                            <td key={key} className={"text-center"}>
                              {notary[key]}
                            </td>
                          ))} */}
                          <td key={notary.address + "name"} className={"text-center overflow-x-auto"}>
                            {notary.name}
                          </td>
                          <td key={notary.address + "total"} className={"text-center"}>
                            {notary.total}
                          </td>
                          <td key={notary.address + "Doc.total"} className={"text-center"}>
                            {notary["Doc.total"]}
                          </td>
                          <td key={notary.address + "Doc.lastNota"} className={"text-center"}>
                            <a href={notary["Doc.lastNota"].href}>{notary["Doc.lastNota"].time}</a>
                          </td>
                          <td key={notary.address + "Marty.total"} className={"text-center"}>
                            {notary["Marty.total"]}
                          </td>
                          <td key={notary.address + "Marty.lastNota"} className={"text-center"}>
                            <a href={notary["Marty.lastNota"].href}>{notary["Marty.lastNota"].time}</a>
                          </td>
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
