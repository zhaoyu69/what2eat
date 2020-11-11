import React, {useEffect, useMemo, useRef, useState} from 'react';
import styles from './index.less';
import {ClearOutlined} from "@ant-design/icons/lib";
import {Modal, Tooltip} from "antd";
import { getRandomInt } from "@/utils/common";
import {getResultModalProps} from "./resultModal";

export default function Scratch({ currentPool }) {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const isErase = useRef(null);
  const shakeTimer = useRef(null);
  const [percent, setPercent] = useState(0);
  const [isShake, setIsShake] = useState(false);
  const [key, setKey] = useState(-1);
  const food = useMemo(() => {
    const foods = currentPool?.foods ?? [];
    return foods[key];
  }, [key]);

  useEffect(() => {
    setKey(randomKey());
  }, [currentPool]);

  useEffect(() => {
    initCanvas();
    canvasRef.current?.addEventListener('mousedown', mousedown);
    canvasRef.current?.addEventListener('mouseup', mouseup);
    return () => {
      canvasRef.current?.removeEventListener('mousedown', mousedown);
      canvasRef.current?.removeEventListener('mouseup', mouseup);
      if(shakeTimer.current) {
        clearTimeout(shakeTimer.current);
        shakeTimer.current = null;
      }
    }
  }, []);

  useEffect(() => {
    if(percent > 30) {
      isErase.current = false;
      Modal.info(getResultModalProps(food));
    }
  }, [percent, food]);

  function randomKey() {
    return getRandomInt(0, currentPool?.foods?.length);
  }

  // 初始化蒙层
  function initCanvas() {
    if(canvasRef.current) {
      canvasRef.current.width = contentRef.current?.offsetWidth;
      canvasRef.current.height = contentRef.current?.offsetHeight;
      const ctx = canvasRef.current?.getContext("2d");
      ctx.fillStyle = "#ccc";
      ctx.fillRect(0,0, contentRef.current?.offsetWidth, contentRef.current?.offsetHeight);
      ctx.globalCompositeOperation = 'destination-out';
    }
  }

  function fillCircle(x, y) {
    const ctx = canvasRef.current?.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, 15, 0, Math.PI * 2, false);    // 标准画圆
    ctx.fill();
  };

  function mousedown(e) {
    isErase.current = true;
    const { offsetX, offsetY } = e;
    fillCircle(offsetX, offsetY);
    canvasRef.current?.addEventListener('mousemove', mousemove);
  }

  function mousemove(e) {
    if(!isErase.current) {
      return ;
    }
    const { offsetX, offsetY } = e;
    fillCircle(offsetX, offsetY);
    const percent = getErasePercent(contentRef.current?.offsetWidth, contentRef.current?.offsetHeight);
    setPercent(percent);
    // console.log("precent is： " + percent + " %");
  }

  function mouseup() {
    isErase.current = false;
    canvasRef.current?.removeEventListener('mousemove', mousemove);
  }

  // 获取擦除比例
  function getErasePercent(width, height) {
    const ctx = canvasRef.current?.getContext("2d");
    var imgData = ctx.getImageData(0, 0, width, height),    // 得到canvas的像素信息
      pixles = imgData.data,
      transPixs = [];
    for (var i = 0, j = pixles.length; i < j; i += 4) {    // 因为存储的结构为[R, G, B, A]，所以要每次跳4个长度
      var a = pixles[i + 3];    // 拿到存储alpha通道的值
      if (a === 0) {    // alpha通道为0，就代表透明
        transPixs.push(i);
      }
    }
    // 全部的带透明度和不带透明度计算比例
    return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
  }

  function reset() {
    if(!shakeTimer.current) {
      initCanvas();
      setKey(randomKey());
      setIsShake(true);
      shakeTimer.current = setTimeout(() => {
        setIsShake(false);
      }, 2000)
    } else {
      clearTimeout(shakeTimer.current);
      shakeTimer.current = null;
      reset();
    }
  }

  return (
    <div className={styles.scratchContainer}>
      <div className={styles.control}>
        <div className={styles.title}>
          { currentPool?.name }
        </div>
        <div className={styles.actions}>
          <Tooltip placement={'top'} title={'洗一洗重新刮~'} color={"blue"}>
            <ClearOutlined className={styles.item}  onClick={reset}/>
          </Tooltip>
        </div>
      </div>
      <div className={`${styles.content} ${isShake ? 'shake shake-slow shake-constant' : ''}`} ref={contentRef}>
        { isShake ? <div className={styles.shakeTip}>洗洗更健康...</div> : null }
        <canvas className={styles.cover} ref={canvasRef}/>
        <div className={styles.food}>
          <div className={styles.foodImg}>
            <img src={food?.thumbUrl} alt=""/>
          </div>
          <div className={styles.foodName}>
            { food?.name }
          </div>
        </div>
      </div>
    </div>
  );
}
