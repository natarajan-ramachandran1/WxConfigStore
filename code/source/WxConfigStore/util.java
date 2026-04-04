package WxConfigStore;

// -----( IS Java Code Template v1.2

import com.wm.data.*;
import com.wm.util.Values;
import com.wm.app.b2b.server.Service;
import com.wm.app.b2b.server.ServiceException;
// --- <<IS-START-IMPORTS>> ---
import java.net.InetAddress;
import java.net.UnknownHostException;
import com.wm.util.Debug;
import java.io.*;
import java.util.*;
import java.util.concurrent.Callable;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.lang.System;
import com.wm.app.b2b.server.*;
import com.wm.util.Table;
import java.text.*;
import com.wm.lang.ns.*;
import com.wm.app.b2b.util.GenUtil;
// --- <<IS-END-IMPORTS>> ---

public final class util

{
	// ---( internal utility methods )---

	final static util _instance = new util();

	static util _newInstance() { return new util(); }

	static util _cast(Object o) { return (util)o; }

	// ---( server methods )---




	public static final void getCurrentDirectory (IData pipeline)
        throws ServiceException
	{
		// --- <<IS-START(getCurrentDirectory)>> ---
		// @sigtype java 3.5
		// [o] field:0:required dir
		// pipeline
		
		// pipeline
		IDataCursor pipelineCursor = pipeline.getCursor();
		String dir = System.getProperty("user.dir");
		IDataUtil.put( pipelineCursor, "dir", dir );
		pipelineCursor.destroy();
		
			
		// --- <<IS-END>> ---

                
	}



	public static final void throwException (IData pipeline)
        throws ServiceException
	{
		// --- <<IS-START(throwException)>> ---
		// @sigtype java 3.5
		// [i] field:0:optional message
		IDataCursor idc = pipeline.getCursor();
		
		String message="";
		
		idc = pipeline.getCursor();
		
		if (idc.first("message"))
			message = (String)idc.getValue();
		
		idc.destroy();
		
		throw new ServiceException(message);		
			
		// --- <<IS-END>> ---

                
	}

	// --- <<IS-START-SHARED>> ---
	static class GenCallable implements Callable<IData>
	{
		IData pipeline;
		NSName NSServiceName;
		Session sess;
		long time = -1;
		
		public GenCallable(IData pipeline, NSName NSServiceName, Session sess)
		{
			this.pipeline = pipeline;
			this.NSServiceName = NSServiceName;
			this.sess = sess;
		}
	
		public IData call() throws Exception {
			// TODO Auto-generated method stub
			try 
			{
			   ServiceThread servth = Service.doThreadInvoke(NSServiceName, sess, pipeline, time);
			   
			   IData Output = servth.getIData();
			   
			   return Output;
			   
			}
			catch (Exception e)
			{
				throw new ServiceException("Unable to invoke the service " + NSServiceName +" - "+ e.getMessage());
			}
		}
	}
	
	private static final Values convert(Hashtable hT)
	{
	  // Following statement gets all arrays in this object.
	  boolean nullFlag = false;
	  Object[] hTArray = hT.values().toArray();
	  Enumeration hTEnumeration = hT.keys();
	  Values outbound = new Values();
	
	  for (int i = 0; i < hTArray.length; i++)
	  {
	    String key = (String) hTEnumeration.nextElement();
	    if (hTArray[i] instanceof java.lang.String)
	    {
	      outbound.put(key, (String) hTArray[i]);
	    }
	    else if (hTArray[i] instanceof java.util.Hashtable)
	    {
	      Values internalObject = convert((Hashtable) hTArray[i]);
	      if (internalObject == null)
	      {
	        nullFlag = true;
	        return null;
	      }
	      outbound.put(key, internalObject);
	    }
	    else
	    {
	      System.out.println("Conversion Failure:" + "unsupported type within inbound Hashtable.");
	      return null;
	    }
	  }
	  return outbound;
	}	
		
	// --- <<IS-END-SHARED>> ---
}

